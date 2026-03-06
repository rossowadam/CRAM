import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

/* ============================================================
    Helpers & Fixtures
============================================================ */

const mockCourses = [
{
    _id: "1",
    title: "Introduction to Computer Science",
    subject: "COMP",
    number: "1010",
    courseCode: "COMP 1010",
    description: "An intro course to CS concepts.",
    credits: 3,
    prerequisites: "None",
    attributes: "Lab",
},
{
    _id: "2",
    title: "Calculus One",
    subject: "MATH",
    number: "1500",
    courseCode: "MATH 1500",
    description: "Differential calculus.",
    credits: 3,
    prerequisites: "Pre-Calculus 40S",
    attributes: "Lecture",
},
{
    _id: "3",
    title: "Technical Writing",
    subject: "ENGL",
    number: "1400",
    courseCode: "ENGL 1400",
    description: "Writing for technical contexts.",
    credits: 3,
    prerequisites: "None",
    attributes: "",
},
];

function renderHome() {
    return render(
        <MemoryRouter>
        <Home />
        </MemoryRouter>
    );
}

function mockFetchSuccess(courses = mockCourses) {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => courses,
    } as Response);
}

function mockFetchFailure() {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
    } as Response);
}

beforeEach(() => {
vi.restoreAllMocks();
});

/* ============================================================
    Fetch States
============================================================ */
describe("Home — fetch states", () => {

    it("shows loading indicator while fetching", () => {
        // Never resolves so loading state persists.
        vi.spyOn(globalThis, "fetch").mockReturnValueOnce(new Promise(() => {}));
        renderHome();
        expect(screen.getByText("Loading courses...")).toBeInTheDocument();
    });

    it("renders course cards after successful fetch", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );
        expect(screen.getByText("Calculus One")).toBeInTheDocument();
        expect(screen.getByText("Technical Writing")).toBeInTheDocument();
    });

    it("shows error message when fetch fails", async () => {
        mockFetchFailure();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText(/Failed to fetch courses/i)).toBeInTheDocument()
        );
    });

    it("shows error message when fetch throws a network error", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"));
        renderHome();

        await waitFor(() =>
        expect(screen.getByText(/Network error/i)).toBeInTheDocument()
        );
    });

    it("shows empty state when API returns no courses", async () => {
        mockFetchSuccess([]);
        renderHome();

        await waitFor(() =>
        expect(screen.getByText(/No Courses found/i)).toBeInTheDocument()
        );
    });
});

/* ============================================================
    Search / Filter
============================================================ */
describe("Home — search and filter", () => {

    it("shows all courses when search query is empty", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );
        expect(screen.getByText("Calculus One")).toBeInTheDocument();
        expect(screen.getByText("Technical Writing")).toBeInTheDocument();
    });

    it("filters courses by title", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        fireEvent.change(screen.getByPlaceholderText(/search/i), {
        target: { value: "calculus" },
        });

        await waitFor(() => {
        expect(screen.getByText("Calculus One")).toBeInTheDocument();
        expect(screen.queryByText("Introduction to Computer Science")).not.toBeInTheDocument();
        expect(screen.queryByText("Technical Writing")).not.toBeInTheDocument();
        });
    });

    it("filters courses by course code", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        fireEvent.change(screen.getByPlaceholderText(/search/i), {
        target: { value: "COMP 1010" },
        });

        await waitFor(() => {
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument();
        expect(screen.queryByText("Calculus One")).not.toBeInTheDocument();
        });
    });

    it("is case-insensitive when filtering", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Calculus One")).toBeInTheDocument()
        );

        fireEvent.change(screen.getByPlaceholderText(/search/i), {
        target: { value: "CALCULUS" },
        });

        await waitFor(() =>
        expect(screen.getByText("Calculus One")).toBeInTheDocument()
        );
    });

    it("shows empty state when search matches no courses", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        fireEvent.change(screen.getByPlaceholderText(/search/i), {
        target: { value: "zzzznotacourse" },
        });

        await waitFor(() =>
        expect(screen.getByText(/No Courses found/i)).toBeInTheDocument()
        );
    });
});

/* ============================================================
    Expand / Collapse
============================================================ */
describe("Home — expand and collapse", () => {

    it("does not show course description before expanding", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        expect(screen.queryByText("An intro course to CS concepts.")).not.toBeInTheDocument();
    });

    it("shows course description after clicking Show more", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        const buttons = screen.getAllByText("Show more");
        fireEvent.click(buttons[0]);

        await waitFor(() =>
        expect(screen.getByText("An intro course to CS concepts.")).toBeInTheDocument()
        );
    });

    it("hides course description after clicking Show less", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        const showMore = screen.getAllByText("Show more");
        fireEvent.click(showMore[0]);

        await waitFor(() =>
        expect(screen.getByText("Show less")).toBeInTheDocument()
        );

        fireEvent.click(screen.getByText("Show less"));

        await waitFor(() =>
        expect(screen.queryByText("An intro course to CS concepts.")).not.toBeInTheDocument()
        );
    });

    it("shows prerequisite info when expanded", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Calculus One")).toBeInTheDocument()
        );

        const buttons = screen.getAllByText("Show more");
        fireEvent.click(buttons[1]);

        await waitFor(() =>
        expect(screen.getByText("Has Prerequisite(s)")).toBeInTheDocument()
        );
    });

    it("shows no prerequisite info when expanded for a course with none", async () => {
        mockFetchSuccess();
        renderHome();

        await waitFor(() =>
        expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument()
        );

        const buttons = screen.getAllByText("Show more");
        fireEvent.click(buttons[0]);

        await waitFor(() =>
        expect(screen.getByText("No Prerequisites")).toBeInTheDocument()
        );
    });
});
