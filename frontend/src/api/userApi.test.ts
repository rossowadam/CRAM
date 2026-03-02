import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser } from "./userApi";

// mock the backend and test valid input and the possible errors received
describe("createUser", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const validPayload = {
        name: "John",
        email: "john@umanitoba.ca",
        password: "password123"
    };

    // valid
    it("returns body when response is ok", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => ({ id: "123", name: "John" })
        } as unknown as Response);

        const result = await createUser(validPayload);

        expect(result).toEqual({ id: "123", name: "John" });
    });

    // user exists error
    it("throws 409 conflict error message", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 409,
        json: async () => ({ error: "User already exists" })
        } as any);

        await expect(createUser(validPayload))
        .rejects.toThrow("User already exists");
    });

    // incorrect domain error
    it("throws 403 forbidden error message", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 403,
        json: async () => ({ error: "Email domain is not allowed" })
        } as unknown as Response);

        await expect(createUser(validPayload))
        .rejects.toThrow("Email domain is not allowed");
    });

    // incomplete data error
    it("throws 422 validation error message", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 422,
        json: async () => ({ error: "User data is incomplete" })
        } as unknown as Response);

        await expect(createUser(validPayload))
        .rejects.toThrow("User data is incomplete");
    });

    // other 400-level error
    it("throws generic error for unexpected status (404)", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
        json: async () => ({ error: "Not Found" })
        } as unknown as Response);

        await expect(createUser(validPayload))
        .rejects.toThrow("Something went wrong. Please try again.");
    });
    
    // server error
    it("throws generic error for unexpected status (500)", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 500,
        json: async () => ({ error: "Internal server error" })
        } as unknown as Response);

        await expect(createUser(validPayload))
        .rejects.toThrow("Something went wrong. Please try again.");
    });
});