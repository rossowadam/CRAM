import { describe, it, expect } from "vitest";
import {
    slugifyCourseCode,
    normalizeAttributes,
    inferHasLab,
} from "./homeHelpers";

/* ============================================================
    slugifyCourseCode
   ============================================================ */
describe("slugifyCourseCode", () => {

    /* ------------------------
        Standard Cases
    -------------------------*/
    it("lowercases the course code", () => {
        expect(slugifyCourseCode("COMP 1010")).toBe("comp-1010");
    });

    it("replaces spaces with hyphens", () => {
        expect(slugifyCourseCode("MATH 1500")).toBe("math-1500");
    });

    it("trims leading and trailing whitespace", () => {
        expect(slugifyCourseCode("  COMP 1010  ")).toBe("comp-1010");
    });

    it("collapses multiple internal spaces into a single hyphen", () => {
        expect(slugifyCourseCode("COMP   1010")).toBe("comp-1010");
    });

    /* ------------------------
        Special Characters
    -------------------------*/
    it("strips special characters", () => {
        expect(slugifyCourseCode("COMP/1010!")).toBe("comp1010");
    });

    it("preserves hyphens already in the code", () => {
        expect(slugifyCourseCode("COMP-1010")).toBe("comp-1010");
    });

    /* ------------------------
        Edge Cases
    -------------------------*/
    it("returns empty string for empty input", () => {
        expect(slugifyCourseCode("")).toBe("");
    });

    it("handles undefined gracefully", () => {
        expect(slugifyCourseCode(undefined as unknown as string)).toBe("");
    });

    it("handles a code that is only whitespace", () => {
        expect(slugifyCourseCode("   ")).toBe("");
    });

    it("handles a single word code with no number", () => {
        expect(slugifyCourseCode("COMP")).toBe("comp");
    });
    });

    /* ============================================================
        normalizeAttributes
    ============================================================ */
    describe("normalizeAttributes", () => {

    /* ------------------------
        Array Input
    -------------------------*/
    it("returns array input as trimmed strings", () => {
        expect(normalizeAttributes(["Lab", " Lecture "])).toEqual(["Lab", "Lecture"]);
    });

    it("filters out empty strings from array input", () => {
        expect(normalizeAttributes(["Lab", "", "  "])).toEqual(["Lab"]);
    });

    it("returns empty array for empty array input", () => {
        expect(normalizeAttributes([])).toEqual([]);
    });

    /* ------------------------
        String Input
    -------------------------*/
    it("splits a comma-separated string", () => {
        expect(normalizeAttributes("Lab,Lecture,Tutorial")).toEqual(["Lab", "Lecture", "Tutorial"]);
    });

    it("splits a semicolon-separated string", () => {
        expect(normalizeAttributes("Lab;Lecture")).toEqual(["Lab", "Lecture"]);
    });

    it("splits a pipe-separated string", () => {
        expect(normalizeAttributes("Lab|Lecture")).toEqual(["Lab", "Lecture"]);
    });

    it("trims whitespace around entries in a string", () => {
        expect(normalizeAttributes("Lab , Lecture , Tutorial")).toEqual(["Lab", "Lecture", "Tutorial"]);
    });

    it("filters out empty segments from string input", () => {
        expect(normalizeAttributes("Lab,,Lecture")).toEqual(["Lab", "Lecture"]);
    });

    /* ------------------------
        Non-String / Non-Array Input
    -------------------------*/
    it("returns empty array for null input", () => {
        expect(normalizeAttributes(null)).toEqual([]);
    });

    it("returns empty array for undefined input", () => {
        expect(normalizeAttributes(undefined)).toEqual([]);
    });

    it("returns empty array for numeric input", () => {
        expect(normalizeAttributes(42)).toEqual([]);
    });
    });

    /* ============================================================
        inferHasLab
    ============================================================ */
    describe("inferHasLab", () => {

    /* ------------------------
        Positive Cases (has lab)
    -------------------------*/
    it("returns true when attrs contains 'Lab'", () => {
        expect(inferHasLab(["Lab"], "")).toBe(true);
    });

    it("returns true when attrs contains 'laboratory' (case-insensitive)", () => {
        expect(inferHasLab(["Laboratory"], "")).toBe(true);
    });

    it("returns true when raw string contains 'lab'", () => {
        expect(inferHasLab([], "includes lab component")).toBe(true);
    });

    it("returns true when raw string contains 'laboratory'", () => {
        expect(inferHasLab([], "laboratory sessions weekly")).toBe(true);
    });

    it("is case-insensitive for LAB in raw string", () => {
        expect(inferHasLab([], "LAB")).toBe(true);
    });

    /* ------------------------
        Negative Cases (no lab)
    -------------------------*/
    it("returns false when neither attrs nor raw string mention lab", () => {
        expect(inferHasLab(["Lecture", "Tutorial"], "weekly lectures")).toBe(false);
    });

    it("returns false for empty attrs and empty raw string", () => {
        expect(inferHasLab([], "")).toBe(false);
    });

    it("does not match 'lab' as a substring of another word", () => {
        // e.g. 'elaborate' should not trigger a lab match
        expect(inferHasLab([], "elaborate course structure")).toBe(false);
    });

    it("does not match 'laboratory' as a substring of another word", () => {
        expect(inferHasLab([], "prelaboratory")).toBe(false);
    });

    /* ------------------------
        Edge Cases
    -------------------------*/
    it("returns false for undefined raw string", () => {
        expect(inferHasLab([], undefined as unknown as string)).toBe(false);
    });
});