import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CirclePlus, Search, ChevronUp, ChevronDown } from "lucide-react";

import SectionCard from "@/components/sections/SectionCard";
import SectionDialog from "@/components/sections/SectionDialog";
import DefinitionDialog from "@/components/definitions/DefinitionDialog";
import DefinitionTable from "@/components/definitions/DefinitionTable";
import CourseSidebar from "@/components/layout/CourseSidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import type { Definition, Section } from "@/api/sectionsApi";
import {
  getCoursePage,
  deleteSection,
  deleteDefinition,
} from "@/api/sectionsApi";
import { getCourseCode } from "@/utils/courseHelpers";
import { ApiError } from "@/lib/errors/ApiError";
import { useAuthDialog } from "@/context/useAuthDialog";

/* Preprocessing Data */

type SearchableSection = {
  title: string;
  titleLower: string;
  description: string;
  descriptionLower: string;
  bodyText: string;
  bodyTextLower: string;
  raw: Section;
};

type SearchableDefinition = {
  term: string;
  termLower: string;
  definition: string;
  definitionLower: string;
  example: string;
  exampleLower: string;
  raw: Definition;
};

/* Single Match Navigation */

type SectionSearchResult = {
  kind: "section";
  sectionId: string;
  field: "title" | "description" | "body";
  occurrenceIndexInField: number;
};

type DefinitionSearchResult = {
  kind: "definition";
  definitionId: string;
  field: "term" | "definition" | "example";
  occurrenceIndexInField: number;
};

type SearchResult = SectionSearchResult | DefinitionSearchResult;

type SectionFieldMatchCounts = {
  title: number;
  description: number;
  body: number;
};

type DefinitionFieldMatchCounts = {
  term: number;
  definition: number;
  example: number;
};

type GroupedSectionSearchResult = {
  kind: "section";
  sectionId: string;
  counts: SectionFieldMatchCounts;
  total: number;
};

type GroupedDefinitionSearchResult = {
  kind: "definition";
  definitionId: string;
  counts: DefinitionFieldMatchCounts;
  total: number;
};


// Groups individual results.
type GroupedSearchResult =
  | GroupedSectionSearchResult
  | GroupedDefinitionSearchResult;

// Used for n-gram search.
type SearchIndex = {
  sectionsByGram: Map<string, Set<string>>;
  definitionsByGram: Map<string, Set<string>>;
};

// Props for the memoized row wrapper.
type SectionCardRowProps = {
  section: Section;
  definitions: Definition[];
  query: string;
  isMatch: boolean;
  isOpen: boolean;
  isActiveMatch: boolean;
  activeField: SectionSearchResult["field"] | null;
  activeOccurrenceIndex: number | null;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => Promise<void>;
  onOpenSectionChange: (sectionId: string, nextOpen: boolean) => void;
};

/* Memoized Components */

const MemoizedSectionCard = memo(SectionCard);
const MemoizedDefinitionTable = memo(DefinitionTable);

// Renders one section card and only updates it when its own state changes.
// Prevents search navigation from re-rendering the whole section list.
const SectionCardRow = memo(function SectionCardRow({
  section,
  definitions,
  query,
  isMatch,
  isOpen,
  isActiveMatch,
  activeField,
  activeOccurrenceIndex,
  onEdit,
  onDelete,
  onOpenSectionChange,
}: SectionCardRowProps) {
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenSectionChange(section._id, nextOpen);
    },
    [onOpenSectionChange, section._id]
  );

  return (
    <div id={`section-${section._id}`} className="w-full bg-primary">
      <MemoizedSectionCard
        section={section}
        definitions={definitions}
        onEdit={onEdit}
        onDelete={onDelete}
        open={isOpen}
        onOpenChange={handleOpenChange}
        searchQuery={isMatch ? query : ""}
        isActiveSearchResult={isActiveMatch}
        activeField={activeField}
        activeOccurrenceIndex={activeOccurrenceIndex}
      />
    </div>
  );
});

// Converts HTML string content into plain text.
function htmlToText(html: string): string {
  if (!html) return "";

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}


// Counts how many times a query appears in a given string.
// Assumes both inputs are already lowercase.
function countOccurrencesInLowerText(
  lowerText: string,
  lowerQuery: string
): number {
  if (!lowerQuery) return 0;

  let count = 0;
  let startIndex = 0;

  // Loop through the string and count non-overlapping matches.
  while (true) {
    const matchIndex = lowerText.indexOf(lowerQuery, startIndex);
    if (matchIndex === -1) break;

    count += 1;
    startIndex = matchIndex + lowerQuery.length;
  }

  return count;
}

// Breaks text into small chunks so search can narrow down "likely" matches first.
// This avoids scanning every section and definition for longer queries.
// Still not 100% sure 3-gram is best.
// Reference if others want to look into this: https://en.wikipedia.org/wiki/N-gram.
function getSearchGrams(lowerText: string): string[] {
  if (!lowerText) return [];

  if (lowerText.length < 3) {
    return [lowerText];
  }

  const grams: string[] = [];

  for (let i = 0; i <= lowerText.length - 3; i += 1) {
    grams.push(lowerText.slice(i, i + 3));
  }

  return grams;
}

// Adds one searchable item into the gram index.
// This lets later searches jump straight to "likely" words.
function addToIndex(index: Map<string, Set<string>>, lowerText: string, id: string): void {
  const grams = getSearchGrams(lowerText);

  grams.forEach((gram) => {
    const existing = index.get(gram);

    if (existing) {
      existing.add(id);
      return;
    }

    index.set(gram, new Set([id]));
  });
}

// Keeps only ids that appear in every matching gram bucket.
// This gives a smaller set before doing exact substring matching.
function intersectSets<T>(sets: Set<T>[]): Set<T> {
  if (sets.length === 0) {
    return new Set();
  }

  const [first, ...rest] = [...sets].sort((a, b) => a.size - b.size);
  const result = new Set(first);

  rest.forEach((set) => {
    result.forEach((value) => {
      if (!set.has(value)) {
        result.delete(value);
      }
    });
  });

  return result;
}

// Looks up "likely" matching ids for the current query.
// Short queries skip the index because they are too broad.
function getCandidateIds(index: Map<string, Set<string>>, lowerQuery: string): Set<string> | null {
  if (!lowerQuery) {
    return null;
  }

  const grams = getSearchGrams(lowerQuery);

  if (grams.length === 0) {
    return null;
  }

  const matchingSets = grams.map((gram) => index.get(gram) ?? new Set<string>());

  return intersectSets(matchingSets);
}

// Converts a flat result index into the exact thing (with it's items, fields, and number of occurrences).
// This helped speed up navigation since we aren't building every result object up front now.
function getSearchResultAtIndex(
  groupedResults: GroupedSearchResult[],
  targetIndex: number
): SearchResult | null {
  if (groupedResults.length === 0 || targetIndex < 0) {
    return null;
  }

  let seen = 0;

  for (const result of groupedResults) {
    if (targetIndex >= seen + result.total) {
      seen += result.total;
      continue;
    }

    let offset = targetIndex - seen;

    if (result.kind === "section") {
      const fields: Array<keyof SectionFieldMatchCounts> = [
        "title",
        "description",
        "body",
      ];

      for (const field of fields) {
        const count = result.counts[field];

        if (offset < count) {
          return {
            kind: "section",
            sectionId: result.sectionId,
            field,
            occurrenceIndexInField: offset,
          };
        }

        offset -= count;
      }
    } else {
      const fields: Array<keyof DefinitionFieldMatchCounts> = [
        "term",
        "definition",
        "example",
      ];

      for (const field of fields) {
        const count = result.counts[field];

        if (offset < count) {
          return {
            kind: "definition",
            definitionId: result.definitionId,
            field,
            occurrenceIndexInField: offset,
          };
        }

        offset -= count;
      }
    }
  }

  return null;
}

export default function Course() {
  // Core state for course content.
  const {openAuthDialog} = useAuthDialog();
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const { courseId } = useParams();

  // Section dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);

  // Definition dialog state
  const [definitionOpen, setDefinitionOpen] = useState(false);
  const [editDefinition, setEditDefinition] = useState<Definition | null>(null);

  // Queries
  const [query, setQuery] = useState("");
  const [manuallyOpenSectionIds, setManuallyOpenSectionIds] = useState<string[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastRepeatedNavigationAtRef = useRef(0);

  if (!courseId) throw new Error("Missing course id");
  const courseCode = getCourseCode(courseId);

  // Fetches the latest course data (sections + definitions) from the backend.
  // Reused across create/edit/delete to keep UI in sync.
  const fetchCoursePage = useCallback(async (): Promise<void> => {
    try {
      const data = await getCoursePage(courseCode);
      setSections(data.sections ?? []);
      setDefinitions(data.definitions ?? []);
    } catch (err) {
      console.error(err);
    }
  }, [courseCode]);

  // Initial data load on mount or when course changes.
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const data = await getCoursePage(courseCode);
        setSections(data.sections ?? []);
        setDefinitions(data.definitions ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitial();
  }, [courseCode]);

  // Ctrl-f shortcut to use the search feature of the course page.
  useEffect(() => {
    const handleFindShortcut = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleFindShortcut);

    return () => {
      window.removeEventListener("keydown", handleFindShortcut);
    };
  }, []);
  
  // Deletes a section and refreshes data.
  const handleDeleteSection = useCallback(async (section: Section): Promise<void> => {
    try {
      await deleteSection({ sectionId: section._id });

      await fetchCoursePage();
    } catch (err) {
      if (err instanceof ApiError){
        openAuthDialog("login");
      } else{
          console.error(err);
          alert(err instanceof Error ? err.message : "Failed to delete section");
      }
    }
  }, [fetchCoursePage, openAuthDialog]);

  // Re-fetch after updating section.
  const handleUpdateSection = useCallback(async (): Promise<void> => {
    await fetchCoursePage();
  }, [fetchCoursePage]);

  // Re-fetch after creating or updating a definition.
  const handleAddOrUpdateDefinition = useCallback(async (): Promise<void> => {
    await fetchCoursePage();
  }, [fetchCoursePage]);

  // Deletes a definition and refreshes data.
  const handleDeleteDefinition = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDefinition({ definitionId: id });
      await fetchCoursePage();
    } catch (err) {
      if (err instanceof ApiError){
        openAuthDialog("login");;
      } else{
          console.error("failed to delete definition:", err);
      }
    }
  }, [fetchCoursePage, openAuthDialog]);


  // Opens the section dialog with the selected section loaded in.
  // Keeping this callback stable helps memoized section cards avoid extra re-renders.
  const handleEditSectionOpen = useCallback((selectedSection: Section): void => {
    setEditSection(selectedSection);
    setOpenCreate(true);
  }, []);

  // Updates the local open-state list for a single section.
  // This keeps expansion changes targeted to just the section that changed.
  const handleSectionOpenChange = useCallback(
    (sectionId: string, nextOpen: boolean): void => {
      setManuallyOpenSectionIds((prev) =>
        nextOpen
          ? [...new Set([...prev, sectionId])]
          : prev.filter((id) => id !== sectionId)
      );
    },
    []
  );

  // Opens the definition dialog with the selected definition loaded in.
  // Keeping this callback stable helps the definition table avoid extra re-renders.
  const handleEditDefinitionOpen = useCallback((definition: Definition): void => {
    setEditDefinition(definition);
    setDefinitionOpen(true);
  }, []);

  // Prepares sections for searching by:
  // - Normalizing text (lowercase)
  // - Stripping HTML from body
  // - Keeping original reference
  const searchableSections = useMemo<SearchableSection[]>(() => {
    return sections.map((section) => {
      const title = section.title ?? "";
      const description = section.description ?? "";
      const bodyText = htmlToText(section.body ?? "");

      return {
        title,
        titleLower: title.toLowerCase(),
        description,
        descriptionLower: description.toLowerCase(),
        bodyText,
        bodyTextLower: bodyText.toLowerCase(),
        raw: section,
      };
    });
  }, [sections]);

  // Same thing as searchableSections above but for definitions.
  const searchableDefinitions = useMemo<SearchableDefinition[]>(() => {
    return definitions.map((definition) => {
      const term = definition.term ?? "";
      const definitionText = definition.definition ?? "";
      const example = definition.example ?? "";

      return {
        term,
        termLower: term.toLowerCase(),
        definition: definitionText,
        definitionLower: definitionText.toLowerCase(),
        example,
        exampleLower: example.toLowerCase(),
        raw: definition,
      };
    });
  }, [definitions]);

  const searchIndex = useMemo<SearchIndex>(() => {
    const sectionsByGram = new Map<string, Set<string>>();
    const definitionsByGram = new Map<string, Set<string>>();

    searchableSections.forEach((section) => {
      addToIndex(sectionsByGram, section.titleLower, section.raw._id);
      addToIndex(sectionsByGram, section.descriptionLower, section.raw._id);
      addToIndex(sectionsByGram, section.bodyTextLower, section.raw._id);
    });

    searchableDefinitions.forEach((definition) => {
      addToIndex(definitionsByGram, definition.termLower, definition.raw._id);
      addToIndex(definitionsByGram, definition.definitionLower, definition.raw._id);
      addToIndex(definitionsByGram, definition.exampleLower, definition.raw._id);
    });

    return {
      sectionsByGram,
      definitionsByGram,
    };
  }, [searchableSections, searchableDefinitions]);

  // Core search engine:
  // - Finds matches across sections and definitions
  // - Tracks which field matched
  // - Tracks occurrence index for highlighting specific matches
  const searchResults = useMemo<GroupedSearchResult[]>(() => {
    const trimmed = query.trim();
    const lowerQuery = trimmed.toLowerCase();

    if (!lowerQuery) {
      return [];
    }

    const results: GroupedSearchResult[] = [];
    const sectionCandidates =
      lowerQuery.length < 3
        ? null
        : getCandidateIds(searchIndex.sectionsByGram, lowerQuery);
    const definitionCandidates =
      lowerQuery.length < 3
        ? null
        : getCandidateIds(searchIndex.definitionsByGram, lowerQuery);

    // Search through sections.
    searchableSections.forEach((section) => {
      if (sectionCandidates !== null && !sectionCandidates.has(section.raw._id)) {
        return;
      }

      const counts: SectionFieldMatchCounts = {
        title: countOccurrencesInLowerText(section.titleLower, lowerQuery),
        description: countOccurrencesInLowerText(
          section.descriptionLower,
          lowerQuery
        ),
        body: countOccurrencesInLowerText(section.bodyTextLower, lowerQuery),
      };

      const total = counts.title + counts.description + counts.body;

      if (total === 0) {
        return;
      }

      results.push({
        kind: "section",
        sectionId: section.raw._id,
        counts,
        total,
      });
    });

    // Search through definitions.
    searchableDefinitions.forEach((definition) => {
      if (
        definitionCandidates !== null &&
        !definitionCandidates.has(definition.raw._id)
      ) {
        return;
      }

      const counts: DefinitionFieldMatchCounts = {
        term: countOccurrencesInLowerText(definition.termLower, lowerQuery),
        definition: countOccurrencesInLowerText(
          definition.definitionLower,
          lowerQuery
        ),
        example: countOccurrencesInLowerText(definition.exampleLower, lowerQuery),
      };

      const total = counts.term + counts.definition + counts.example;

      if (total === 0) {
        return;
      }

      results.push({
        kind: "definition",
        definitionId: definition.raw._id,
        counts,
        total,
      });
    });

    return results;
  }, [query, searchableSections, searchableDefinitions, searchIndex]);

  const isSearching = query.trim().length > 0;

  const totalSearchResults = useMemo<number>(() => {
    return searchResults.reduce((sum, result) => sum + result.total, 0);
  }, [searchResults]);

  // IDs of sections that contain matches (for highlighting).
  const matchingSectionIds = useMemo<Set<string>>(() => {
    return new Set(
      searchResults
        .filter(
          (result): result is GroupedSectionSearchResult => result.kind === "section"
        )
        .map((result) => result.sectionId)
    );
  }, [searchResults]);

  // Sections automatically expanded when searching.
  const autoOpenSectionIds = useMemo<string[]>(() => {
    if (!isSearching) {
      return [];
    }

    return [
      ...new Set(
        searchResults
          .filter(
            (result): result is GroupedSectionSearchResult =>
              result.kind === "section"
          )
          .map((result) => result.sectionId)
      ),
    ];
  }, [isSearching, searchResults]);

  // Final list of sections is both sections opened by the user and auto-expanded from above.
  const openSectionIds = useMemo<string[]>(() => {
    return [...new Set([...manuallyOpenSectionIds, ...autoOpenSectionIds])];
  }, [manuallyOpenSectionIds, autoOpenSectionIds]);

  // Ensures active index stays within bounds, was causing issues with linter.
  const safeActiveResultIndex = useMemo<number>(() => {
    if (totalSearchResults === 0) {
      return 0;
    }

    return Math.min(activeResultIndex, totalSearchResults - 1);
  }, [activeResultIndex, totalSearchResults]);

  const activeResult = useMemo<SearchResult | null>(() => {
    return getSearchResultAtIndex(searchResults, safeActiveResultIndex);
  }, [searchResults, safeActiveResultIndex]);

  const activeDefinitionResult =
    activeResult !== null && activeResult.kind === "definition"
      ? activeResult
      : null;

  // Holding enter was causing crazy jumps in search.
  // This will will throttle repeated key presses (like when holding enter).
  // I have it at 33ms of delay before it ignores input to try and keep it at ~30 fps in the worst case.
  const shouldHandleRepeatedNavigation = useCallback((isRepeatedKeydown: boolean): boolean => {
    if (!isRepeatedKeydown) {
      return true;
    }

    const now = performance.now();

    if (now - lastRepeatedNavigationAtRef.current < 33) {
      return false;
    }

    lastRepeatedNavigationAtRef.current = now;
    return true;
  }, []);

  // Navigation helpers for search results
  const goToNextResult = useCallback((step = 1): void => {
    if (!isSearching || totalSearchResults === 0) {
      return;
    }

    setActiveResultIndex(
      (prev) => (prev + step + totalSearchResults) % totalSearchResults
    );
  }, [isSearching, totalSearchResults]);

  // Navigation helpers for search results
  const goToPreviousResult = useCallback((step = 1): void => {
    if (!isSearching || totalSearchResults === 0) {
      return;
    }

    setActiveResultIndex(
      (prev) => ((prev - step) % totalSearchResults + totalSearchResults) % totalSearchResults
    );
  }, [isSearching, totalSearchResults]);

  return (
    <SidebarProvider
      defaultOpen={true}
      className="
        [--sidebar-width:8rem]
        md:[--sidebar-width:10rem]
        lg:[--sidebar-width:12rem]
        xl:[--sidebar-width:20rem]
        2xl:[--sidebar-width:clamp(12rem,20vw,37rem)]
      "
    >
      <CourseSidebar sections={sections} courseCode={courseCode} />
      <div className="fixed top-20 left-4 z-50 md:hidden">
        <SidebarTrigger className="bg-secondary text-background hover:cursor-pointer hover:bg-primary hover:text-foreground" />
      </div>

      <SidebarInset className="min-w-0 flex flex-col">
        <div className="flex-1 px-6 py-6 md:px-4">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_clamp(16rem,22vw,24rem)]">
            {/* Left column: main page content */}
            <div className="min-w-0">
              {/* Course page header, this stays static, do not modify with dynamic content */}
              <div className="w-full flex flex-col items-center sm:flex-row sm:gap-3 ">
                <h1 className="text-xl font-bold w-4/5 pb-2 text-center sm:text-3xl xl:text-4xl">
                  Welcome to the {courseId.toUpperCase()} Course Page!
                </h1>
                <>
                  {/* Horizontal on small screens */}
                  <Separator
                    orientation="horizontal"
                    className="bg-secondary sm:hidden my-2"
                  />

                  {/* Vertical on small screens and up */}
                  <Separator
                    orientation="vertical"
                    className="bg-secondary hidden sm:block"
                  />
                </>

                <div className="flex flex-col items-center gap-2 w-full text-center sm:text-left">
                  <p className=" text-base font-thin font-instrument w-full">
                    Here, you can collaborate with your classmates, find
                    resources, and review definitions about all things{" "}
                    {courseId.toUpperCase()}.
                  </p>

                  <p className=" text-base font-thin font-instrument w-full italic">
                    Please remember to be respectful and follow the code of
                    conduct while using this platform. Happy learning!
                  </p>
                </div>
              </div>

              <Separator orientation="horizontal" className="bg-secondary " />

              {/* Course sections heading */}
              <div className="flex flex-row gap-2 w-full justify-between items-center p-2">
                <h2 className="text-xl font-lg text-left w-full mt-4 sm:text-2xl">
                  Sections
                </h2>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <CirclePlus
                      className="hover:text-secondary hover:cursor-pointer"
                      aria-label="Add new section"
                      onClick={() => {
                        setEditSection(null);
                        setOpenCreate(true);
                      }}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="bg-background">
                    <div className="font-instrument text-xs text-center text-foreground">
                      Add a new section to your course page to organize your
                      content and discussions.
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* Display section dialog */}
              <SectionDialog
                open={openCreate}
                onOpenChange={(open) => {
                  if (!open) setEditSection(null);
                  setOpenCreate(open);
                }}
                mode={editSection ? "edit" : "create"}
                courseCode={courseCode}
                initialValues={editSection ?? undefined}
                onSave={handleUpdateSection}
              />

              <Separator
                orientation="horizontal"
                className="bg-foreground my-2"
              />

              {/* Display sections */}
              <div className="bg-primary p-2 rounded-2xl w-full space-y-3">
                {sections.map((section) => {
                  const isMatch = matchingSectionIds.has(section._id);
                  const isOpen = openSectionIds.includes(section._id);

                  const isActiveMatch =
                    activeResult !== null &&
                    activeResult.kind === "section" &&
                    section._id === activeResult.sectionId;

                  const activeOccurrenceInSection = isActiveMatch
                    ? activeResult.occurrenceIndexInField
                    : null;

                  const activeFieldInSection = isActiveMatch
                    ? activeResult.field
                    : null;

                  return (
                    <SectionCardRow
                      key={section._id}
                      section={section}
                      definitions={definitions}
                      query={query}
                      isMatch={isMatch}
                      isOpen={isOpen}
                      isActiveMatch={isActiveMatch}
                      activeField={activeFieldInSection}
                      activeOccurrenceIndex={activeOccurrenceInSection}
                      onEdit={handleEditSectionOpen}
                      onDelete={handleDeleteSection}
                      onOpenSectionChange={handleSectionOpenChange}
                    />
                  );
                })}
              </div>

              {/* Definition table heading */}
              <div
                className="flex flex-row gap-2 w-full justify-between items-center p-2"
                id="definitions"
              >
                <h2 className="text-xl font-lg text-left w-full mt-4 sm:text-2xl">
                  Definitions
                </h2>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <CirclePlus
                      className="hover:text-secondary hover:cursor-pointer"
                      aria-label="Add new definition"
                      onClick={() => {
                        setEditDefinition(null);
                        setDefinitionOpen(true);
                      }}
                    />
                  </HoverCardTrigger>

                  <HoverCardContent side="top" className="bg-background">
                    <div className="font-instrument text-xs text-center text-foreground ">
                      Add a new definition to this course page
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              <DefinitionDialog
                open={definitionOpen}
                onOpenChange={setDefinitionOpen}
                courseCode={courseCode}
                mode={editDefinition ? "edit" : "create"}
                initialValues={editDefinition ?? undefined}
                onSuccess={handleAddOrUpdateDefinition}
              />

              <Separator orientation="horizontal" />

              <MemoizedDefinitionTable
                definitions={definitions}
                onEdit={handleEditDefinitionOpen}
                onDelete={handleDeleteDefinition}
                searchQuery={query}
                activeDefinitionId={activeDefinitionResult?.definitionId ?? null}
                activeField={activeDefinitionResult?.field ?? null}
                activeOccurrenceIndex={
                  activeDefinitionResult?.occurrenceIndexInField ?? null
                }
              />
            </div>

            {/* Right column: search */}
            <div className="hidden xl:block">
              <div className="sticky top-20 z-30">
                {/* Search */}
                <div className="w-full">
                  <div className="flex w-full items-center gap-1 rounded-full border border-border/60 bg-background/85 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

                    <Input
                      ref={searchInputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveResultIndex(0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();

                          if (!shouldHandleRepeatedNavigation(e.repeat)) {
                            return;
                          }

                          if (e.shiftKey) {
                            goToPreviousResult();
                          } else {
                            goToNextResult();
                          }
                        }
                      }}
                      placeholder="Search"
                      className="h-8 w-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />

                    {isSearching && (
                      <>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {totalSearchResults > 0
                            ? `${safeActiveResultIndex + 1}/${totalSearchResults}`
                            : "0"}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => goToPreviousResult()}
                          disabled={totalSearchResults === 0}
                          aria-label="Previous result"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => goToNextResult()}
                          disabled={totalSearchResults === 0}
                          aria-label="Next result"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
