import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";

import { 
  List, 
  type RowComponentProps,
} from "react-window";

// UI Components
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

/* TYPES */
type CourseFromAPI = {
  _id?: string;
  title: string;
  subject: string;
  number: string;
  course_code: string;
  description: string;
  credits: number;
  prerequisites: string;
  attributes: string;
};

type CourseUI = CourseFromAPI & {
  id: string;
  _search: string; // Title + course_code only.
  hasPrereqs: boolean;
  hasLab: boolean;
  attributesList: string[];
};

function slugifyCourseCode(code: string) {
  return (code ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s/g, "-");
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function normalizeAttributes(attributes: unknown): string[] {
  if (Array.isArray(attributes)) {
    return attributes.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof attributes === "string") {
    return attributes
      .split(/[,;|]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

// Lab boolean is not in database.
function inferHasLab(attrs: string[], raw: string) {
  const text = `${attrs.join(" ")} ${raw ?? ""}`.toLowerCase();
  return /\blab\b|\blaboratory\b/.test(text);
}

// Measures its own height and reports it (proper cleanup).
function MeasuredRow(props: {
  id: string;
  onMeasure: (id: string, height: number) => void;
  children: React.ReactNode;
}) {
  const { id, onMeasure, children } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const report = () => onMeasure(id, el.getBoundingClientRect().height);

    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);

    return () => ro.disconnect();
  }, [id, onMeasure]);

  return (
    <div ref={ref} className="px-2 py-2">
      {children}
    </div>
  );
}

type RowExtraProps = {
  items: CourseUI[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  onMeasure: (id: string, index: number, height: number) => void;
};

export default function Home() {
  const [data, setData] = useState<CourseFromAPI[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Forces rerender when heights change (ref updates alone won't rerender).
  const [sizeVersion, setSizeVersion] = useState(0);

  const debouncedQuery = useDebouncedValue(query, 300);
  const deferredQuery = useDeferredValue(debouncedQuery);

  type ListHandle = {
    readonly element: HTMLDivElement | null;
    scrollToRow: (config: {
      index: number;
      align?: "center" | "auto" | "end" | "smart" | "start";
      behavior?: "auto" | "instant" | "smooth";
    }) => void;
  };

  // Inferred type from list.
  const listRef = useRef<ListHandle | null>(null);

  // Height cache.
  const heightMapRef = useRef<Record<string, number>>({});

  const BOTTOM_SPACER = 24;

  /* FETCH COURSES */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/v1/courses");
        if (!res.ok) throw new Error("Failed to fetch courses!");
        const json = await res.json();

        const courses: CourseFromAPI[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.courses)
          ? json.courses
          : [];

        setData(courses);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* BUILD UI COURSE + PRECOMPUTE SEARCH */
  const allCourses: CourseUI[] = useMemo(() => {
    const safe = (s?: string) => String(s ?? "").toLowerCase();

    return data.map((course) => {
      const id = slugifyCourseCode(course.course_code);
      const attributesList = normalizeAttributes(course.attributes);

      // Mongo will default empty strings to "None".
      const prereqText = (course.prerequisites ?? "").toLowerCase().trim();
      const hasPrereqs = !!prereqText && !/^none|n\/a|no prerequisite/i.test(prereqText);

      const hasLab = inferHasLab(attributesList, course.attributes);

      return {
        ...course,
        id,
        attributesList,
        hasPrereqs,
        hasLab,
        _search: [course.title, course.course_code].map(safe).join(" "),
      };
    });
  }, [data]);

  /* SEARCH FILTER */
  const filteredCourses = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return allCourses;
    return allCourses.filter((c) => c._search.includes(q));
  }, [allCourses, deferredQuery]);

  // Reset cache when results change (prevents stale heights causing gaps).
  useEffect(() => {
    heightMapRef.current = {};
    setSizeVersion((v) => v + 1);

    // If expanded course disappears due to filtering, collapse it.
    setExpandedId((cur) => {
      if (!cur) return cur;
      return filteredCourses.some((c) => c.id === cur) ? cur : null;
    });
  }, [filteredCourses]);

  const getRowHeight = useCallback(
    (index: number) => {
      // Spacer row at end for a bit of breathing room.
      if (index === filteredCourses.length) return BOTTOM_SPACER;

      const course = filteredCourses[index];
      return heightMapRef.current[course?.id] ?? 110;
    },
    [filteredCourses, sizeVersion] // Needs sizeVersion to force recalculation.
  );

  // Measure + reset from the changed row (prevents overlap and huge blank gaps).
  const setRowHeight = useCallback((id: string, _index: number, height: number) => {
    const safe = Math.max(120, Math.ceil(height));
    const prev = heightMapRef.current[id];
    if (prev && Math.abs(prev - safe) < 4) return;

    heightMapRef.current = { ...heightMapRef.current, [id]: safe };
    setSizeVersion((v) => v + 1);
  }, []);

  // Toggle expansion + recompute layout after DOM commits.
  const toggleExpanded = useCallback(
    (id: string) => {
      const idx = filteredCourses.findIndex((c) => c.id === id);
      if (idx < 0) return;

      // Optimistic bump to prevent a frame of overlap before ResizeObserver happens.
      heightMapRef.current = {
        ...heightMapRef.current,
        [id]: Math.max(heightMapRef.current[id] ?? 220, 420),
      };
      setSizeVersion((v) => v + 1);

      setExpandedId((cur) => (cur === id ? null : id));

      requestAnimationFrame(() => {
        listRef.current?.scrollToRow?.({ index: idx, align: "smart", behavior: "instant" });
      });
    },
    [filteredCourses]
  );

  const Row = ({
    index,
    style,
    items,
    expandedId,
    onToggle,
    onMeasure,
  }: RowComponentProps<RowExtraProps>) => {
    // Bottom spacer row.
    if (index === items.length) {
      return <div style={style} />;
    }

    const course = items[index];
    const expanded = expandedId === course.id;

    return (
      <div style={style}>
        <MeasuredRow id={course.id} onMeasure={(id, h) => onMeasure(id, index, h)}>
          <Card className="shadow-md">
          <CardHeader>
            <div>
              <Link to={`/course/${course.id}`}>
                <CardTitle className="hover:text-secondary leading-tight">
                  {course.title}
                </CardTitle>
              </Link>
              <CardDescription>
                {course.subject} {course.number}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {expanded && (
              <>
                <p className="text-sm opacity-90 whitespace-pre-wrap">
                  {course.description}
                </p>

                <div className="mt-3 text-xs opacity-80 flex flex-wrap gap-x-4 gap-y-1 items-center">
                  <span>Credits: {course.credits}</span>
                  <span>{course.hasPrereqs ? "Has Pre-Requisite(s)" : "No Pre-Requisite"}</span>

                  <span className="inline-flex items-center gap-1">
                    {course.attributesList.length ? (
                      <span className="inline-flex flex-wrap gap-1">
                        {course.attributesList.map((a) => (
                          <span
                            key={a}
                            className="inline-flex items-center rounded-md border px-2 py-0.5"
                          >
                            {a}
                          </span>
                        ))}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </>
            )}

            {/* Subtle toggle */}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => onToggle(course.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-expanded={expanded}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </div>
          </CardContent>
        </Card>
        </MeasuredRow>
      </div>
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      {/* Header / Search */}
      <div className="shrink-0 px-6 py-6 w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold text-center">Find Your Course</h1>

        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
          className="w-4/5 md:w-3/4 self-center mt-3 mx-auto"
        >
          <InputGroup className="h-12">
            <InputGroupInput
              type="search"
              placeholder="Search by course name or code..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <InputGroupAddon>
              <InputGroupButton type="submit">
                <SearchIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>

        <div className="h-px w-full bg-secondary mt-6" />
      </div>

      {/* List viewport (ONLY scroller) */}
      <div className="flex-1 min-h-0 overflow-hidden w-full max-w-5xl mx-auto px-6 pb-6">
        {loading ? (
          <div className="text-center py-10">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center opacity-60 py-8">No Courses found.</div>
        ) : (
          <List
            className="w-full no-scrollbar snap-y snap-mandatory"
            style={{ height: "100%", width: "100%" }}
            rowCount={filteredCourses.length + 1} // The bottom spacer row.
            rowHeight={getRowHeight}
            rowComponent={Row}
            rowProps={{
              items: filteredCourses,
              expandedId,
              onToggle: toggleExpanded,
              onMeasure: setRowHeight,
            }}
            overscanCount={6}
            listRef={listRef}
          />
        )}
      </div>
    </div>
  );
}
