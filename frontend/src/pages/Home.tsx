import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { List, type RowComponentProps } from "react-window";

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

// Icon + Router
import { SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

/* TYPES (lines up with the backend schema) */
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
  _search: string;
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

function Home() {
  const [data, setData] = useState<CourseFromAPI[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Make input feel instant even if filtering is expensive
  const debouncedQuery = useDebouncedValue(query, 300);
  const deferredQuery = useDeferredValue(debouncedQuery);

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

    return data.map((course) => ({
      ...course,
      id: slugifyCourseCode(course.course_code),
      _search: [
        course.title,
        course.subject,
        course.number,
        course.course_code,
        course.description,
        course.prerequisites,
        course.attributes,
      ]
        .map(safe)
        .join(" "),
    }));
  }, [data]);

  /* SEARCH FILTER */
  const filteredCourses = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    if (!q) return allCourses;
    // Optional micro-optimization: ignore 1-char searches on huge datasets
    // if (q.length < 2) return allCourses;

    return allCourses.filter((course) => course._search.includes(q));
  }, [allCourses, deferredQuery]);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
  };

  /* STATES */
  if (loading) return <div className="text-center py-10">Loading courses...</div>;

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
      </div>
    );
  }

  /* VIRTUALIZED ROW (react-window v2) */
  // IMPORTANT: must be >= actual rendered card height, or rows will overlap.
  const ROW_HEIGHT = 190;

  type RowExtraProps = {
    items: CourseUI[];
  };

  const Row = ({ index, style, items }: RowComponentProps<RowExtraProps>) => {
    const course = items[index];

    return (
      <div style={style} className="px-2 py-2">
        <Card className="shadow-md h-full">
          <CardHeader>
            <Link to={`/course/${course.id}`}>
              <CardTitle className="hover:text-secondary">{course.title}</CardTitle>
            </Link>
            <CardDescription>{course.course_code}</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm line-clamp-2 opacity-80">{course.description}</p>
            <div className="mt-2 text-sm space-y-1">
              <div>Credits: {course.credits}</div>
              <div>Number: {course.number}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-5xl items-center gap-3 mx-auto px-6 py-6">
      <h1 className="text-4xl font-semibold">Find Your Course</h1>

      <form onSubmit={onSearch} className="w-4/5 md:w-3/4">
        <InputGroup className="h-12">
          <InputGroupInput
            type="search"
            placeholder="Search..."
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

      <div className="h-px w-full bg-secondary my-2" />

      {/* COURSE LIST (virtualized) */}
      <div className="w-full" style={{ height: 2000 }}>
        {filteredCourses.length === 0 ? (
          <div className="text-center opacity-60 py-8">No Courses found.</div>
        ) : (
          <List
            className="w-full "
            style={{ height: "100%" }}
            rowCount={filteredCourses.length}
            rowHeight={ROW_HEIGHT}
            rowComponent={Row}
            rowProps={{ items: filteredCourses }}
            // optional: helps with initial measurement / SSR-ish situations
            defaultHeight={650}
          />
        )}
      </div>
    </div>
  );
}

export default Home;