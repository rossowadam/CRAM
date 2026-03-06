import { describe, it, expect } from "vitest";
import { getCourseCode } from "./courseHelpers";

describe("getCourseCode", () => {

    /* ------------------------
        Standard Cases
    -------------------------*/
    it("converts a standard slug to uppercase course code", () => {
        expect(getCourseCode("comp-1010")).toBe("COMP 1010");
    });

    it("converts a four-digit number correctly", () => {
        expect(getCourseCode("math-1500")).toBe("MATH 1500");
    });

    it("handles a subject with more than four letters", () => {
        expect(getCourseCode("abiz-0440")).toBe("ABIZ 0440");
    });

    it("uppercases a subject that is already uppercase", () => {
        expect(getCourseCode("COMP-1010")).toBe("COMP 1010");
    });

    it("handles mixed case subject", () => {
        expect(getCourseCode("Comp-1010")).toBe("COMP 1010");
    });
});