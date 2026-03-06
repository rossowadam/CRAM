import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    createSection,
    getCoursePage,
    updateSection,
    deleteSection,
    createDefinition,
    updateDefinition,
    deleteDefinition,
} from "./sectionsApi";

/* ============================================================
    createSection
   ============================================================ */
describe("createSection", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = {
        courseCode: "COMP 1010",
        title: "Unit 1: Intro",
        description: "An intro unit",
        body: "Body content here",
    };

    const mockSection = { _id: "s1", ...validPayload };

    // valid
    it("returns section when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => mockSection,
        } as unknown as Response);

        const result = await createSection(validPayload);
        expect(result).toEqual(mockSection);
    });

    // unauthenticated
    it("throws 401 error message", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: "Unauthorized" }),
        } as unknown as Response);

        await expect(createSection(validPayload)).rejects.toThrow(
            "Only logged-in users may create sections."
        );
    });

    // conflict
    it("throws 409 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 409,
            json: async () => ({ error: "Section already exists" }),
        } as unknown as Response);

        await expect(createSection(validPayload)).rejects.toThrow("Section already exists");
    });

    // validation error
    it("throws 422 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 422,
            json: async () => ({ error: "Section data is incomplete" }),
        } as unknown as Response);

        await expect(createSection(validPayload)).rejects.toThrow("Section data is incomplete");
    });

    // server error
    it("throws generic error for unexpected status (500)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal server error" }),
        } as unknown as Response);

        await expect(createSection(validPayload)).rejects.toThrow(
            "Internal server error"
        );
    });
});

/* ============================================================
    getCoursePage
   ============================================================ */
describe("getCoursePage", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const mockSections = [
        { _id: "s1", courseCode: "COMP 1010", title: "Unit 1", description: "Intro", body: "Body" },
    ];

    const mockDefinitions = [
        { _id: "d1", courseCode: "COMP 1010", term: "Algorithm", definition: "A set of rules", example: "Sorting" },
    ];

    // valid
    it("returns sections and definitions when both responses are ok", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockSections,
            } as unknown as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockDefinitions,
            } as unknown as Response);

        const result = await getCoursePage("COMP 1010");

        expect(result.courseCode).toBe("COMP 1010");
        expect(result.sections).toEqual(mockSections);
        expect(result.definitions).toEqual(mockDefinitions);
    });

    // sections fetch fails
    it("throws error when sections response is not ok", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: "Failed to load sections." }),
            } as unknown as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockDefinitions,
            } as unknown as Response);

        await expect(getCoursePage("COMP 1010")).rejects.toThrow("Failed to load sections.");
    });

    // definitions fetch fails
    it("throws error when definitions response is not ok", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockSections,
            } as unknown as Response)
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: "Failed to load definitions." }),
            } as unknown as Response);

        await expect(getCoursePage("COMP 1010")).rejects.toThrow("Failed to load definitions.");
    });

    // empty course
    it("returns empty arrays when course has no sections or definitions", async () => {
        vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            } as unknown as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            } as unknown as Response);

        const result = await getCoursePage("COMP 1010");

        expect(result.sections).toEqual([]);
        expect(result.definitions).toEqual([]);
    });
});

/* ============================================================
    updateSection
   ============================================================ */
describe("updateSection", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = { sectionId: "s1", title: "Updated Title" };
    const mockUpdated = { _id: "s1", courseCode: "COMP 1010", title: "Updated Title", description: "", body: "" };

    // valid
    it("returns updated section when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockUpdated,
        } as unknown as Response);

        const result = await updateSection(validPayload);
        expect(result).toEqual(mockUpdated);
    });

    // unauthenticated
    it("throws 401 error message", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: "Unauthorized" }),
        } as unknown as Response);

        await expect(updateSection(validPayload)).rejects.toThrow(
            "Only logged-in users may update sections."
        );
    });

    // not found
    it("throws 404 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: "Section not found." }),
        } as unknown as Response);

        await expect(updateSection(validPayload)).rejects.toThrow("Section not found.");
    });

    // validation error
    it("throws 422 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 422,
            json: async () => ({ error: "Invalid request." }),
        } as unknown as Response);

        await expect(updateSection(validPayload)).rejects.toThrow("Invalid request.");
    });

    // server error
    it("throws generic error for unexpected status (500)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal server error" }),
        } as unknown as Response);

        await expect(updateSection(validPayload)).rejects.toThrow(
            "Internal server error"
        );
    });
});

/* ============================================================
    deleteSection
   ============================================================ */
describe("deleteSection", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = { sectionId: "s1" };

    // valid
    it("returns acknowledgement when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ acknowledged: true, deletedCount: 1 }),
        } as unknown as Response);

        const result = await deleteSection(validPayload);
        expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });

    // unauthenticated
    it("throws 401 error message", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: "Unauthorized" }),
        } as unknown as Response);

        await expect(deleteSection(validPayload)).rejects.toThrow(
            "Only logged-in users may delete sections."
        );
    });

    // not found
    it("throws 404 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: "Section not found." }),
        } as unknown as Response);

        await expect(deleteSection(validPayload)).rejects.toThrow("Section not found.");
    });

    // server error
    it("throws generic error for unexpected status (500)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal server error" }),
        } as unknown as Response);

        await expect(deleteSection(validPayload)).rejects.toThrow(
            "Internal server error"
        );
    });
});

/* ============================================================
    createDefinition
   ============================================================ */
describe("createDefinition", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = {
        courseCode: "COMP 1010",
        term: "Algorithm",
        definition: "A set of rules",
        example: "Sorting",
    };

    const mockDefinition = { _id: "d1", ...validPayload };

    // valid
    it("returns definition when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => mockDefinition,
        } as unknown as Response);

        const result = await createDefinition(validPayload);
        expect(result).toEqual(mockDefinition);
    });

    // unauthenticated
    it("throws 401 error message", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: "Unauthorized" }),
        } as unknown as Response);

        await expect(createDefinition(validPayload)).rejects.toThrow(
            "Only logged-in users may create definitions."
        );
    });

    // conflict
    it("throws 409 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 409,
            json: async () => ({ error: "Definition already exists" }),
        } as unknown as Response);

        await expect(createDefinition(validPayload)).rejects.toThrow("Definition already exists");
    });

    // validation error
    it("throws 422 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 422,
            json: async () => ({ error: "Definition data is incomplete" }),
        } as unknown as Response);

        await expect(createDefinition(validPayload)).rejects.toThrow("Definition data is incomplete");
    });

    // server error
    it("throws generic error for unexpected status (500)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal server error" }),
        } as unknown as Response);

        await expect(createDefinition(validPayload)).rejects.toThrow(
            "Internal server error"
        );
    });
});

/* ============================================================
    updateDefinition
   ============================================================ */
describe("updateDefinition", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = { definitionId: "d1", term: "Updated Term" };
    const mockUpdated = { _id: "d1", courseCode: "COMP 1010", term: "Updated Term", definition: "A set of rules", example: "Sorting" };

    // valid
    it("returns updated definition when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockUpdated,
        } as unknown as Response);

        const result = await updateDefinition(validPayload);
        expect(result).toEqual(mockUpdated);
    });

    // unauthenticated
    it("throws 401 error message", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: "Unauthorized" }),
        } as unknown as Response);

        await expect(updateDefinition(validPayload)).rejects.toThrow(
            "Only logged-in users may update definitions."
        );
    });

    // not found
    it("throws 404 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: "Definition not found." }),
        } as unknown as Response);

        await expect(updateDefinition(validPayload)).rejects.toThrow("Definition not found.");
    });

    // validation error
    it("throws 422 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 422,
            json: async () => ({ error: "Invalid request." }),
        } as unknown as Response);

        await expect(updateDefinition(validPayload)).rejects.toThrow("Invalid request.");
    });

    // server error
    it("throws generic error for unexpected status (500)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal server error" }),
        } as unknown as Response);

        await expect(updateDefinition(validPayload)).rejects.toThrow(
            "Internal server error"
        );
    });
});

/* ============================================================
    deleteDefinition
   ============================================================ */
describe("deleteDefinition", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = { definitionId: "d1" };

    // valid
    it("returns acknowledgement when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ acknowledged: true, deletedCount: 1 }),
        } as unknown as Response);

        const result = await deleteDefinition(validPayload);
        expect(result).toEqual({ acknowledged: true, deletedCount: 1 });
    });

    // unauthenticated
    it("throws 401 error message", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: "Unauthorized" }),
        } as unknown as Response);

        await expect(deleteDefinition(validPayload)).rejects.toThrow(
            "Only logged-in users may delete definitions."
        );
    });

    // not found
    it("throws 404 error message from backend", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: "Definition not found." }),
        } as unknown as Response);

        await expect(deleteDefinition(validPayload)).rejects.toThrow("Definition not found.");
    });

    // server error
    it("throws generic error for unexpected status (500)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({ error: "Internal server error" }),
        } as unknown as Response);

        await expect(deleteDefinition(validPayload)).rejects.toThrow(
            "Internal server error"
        );
    });
});