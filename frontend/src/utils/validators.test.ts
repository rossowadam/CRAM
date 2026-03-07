import { describe, it, expect } from "vitest";
import { validateSignup, validateSignin } from "./validators";

// unit test validate signup
describe("validateSignup", () => {

    const validInput = {
        name: "Tester",
        email: "test@umanitoba.ca",
        password: "password123",
        confirmPassword: "password123",
    };

    /* ------------------------
        Fully Valid Case
    -------------------------*/
    it("returns empty object when input is fully valid", () => {
        expect(validateSignup(validInput)).toEqual({});
    });

    /* ------------------------
        Name Validation
    -------------------------*/
    it("fails when name is empty", () => {
        const result = validateSignup({ ...validInput, name: "" });
        expect(result).toEqual({ name: "Name field was empty" });
    });

    it("fails when name is whitespace only", () => {
        const result = validateSignup({ ...validInput, name: "   " });
        expect(result).toEqual({ name: "Name field was empty" });
    });

    it("passes when name has surrounding spaces", () => {
        const result = validateSignup({ ...validInput, name: "  Tester  " });
        expect(result).toEqual({});
    });

    /* ------------------------
        Email Validation
    -------------------------*/
    it("fails when email domain is invalid", () => {
        const result = validateSignup({ ...validInput, email: "test@gmail.com" });
        expect(result).toEqual({ email: "Email domain is not valid" });
    });

    it("fails when email has wrong university-like domain", () => {
        const result = validateSignup({ ...validInput, email: "test@umanitoba.com" });
        expect(result).toEqual({ email: "Email domain is not valid" });
    });

    it("passes for @myumanitoba.ca", () => {
        const result = validateSignup({
        ...validInput,
        email: "student@myumanitoba.ca",
        });
        expect(result).toEqual({});
    });

    it("passes for @umanitoba.ca", () => {
        const result = validateSignup({
        ...validInput,
        email: "prof@umanitoba.ca",
        });
        expect(result).toEqual({});
    });

    it("fails for uppercase email domain (case-sensitive check)", () => {
        const result = validateSignup({
        ...validInput,
        email: "TEST@UMANITOBA.CA",
        });
        expect(result).toEqual({ email: "Email domain is not valid" });
    });

    it("fails for trailing whitespace in email", () => {
        const result = validateSignup({
        ...validInput,
        email: "test@umanitoba.ca ",
        });
        expect(result).toEqual({ email: "Email domain is not valid" });
    });

    /* ------------------------
        Password Length
    -------------------------*/
    it("fails when password is shorter than 8 characters", () => {
        const result = validateSignup({
        ...validInput,
        password: "1234567",
        confirmPassword: "1234567",
        });
        expect(result).toEqual({ password: "Password too short" });
    });

    it("passes when password is exactly 8 characters", () => {
        const result = validateSignup({
        ...validInput,
        password: "12345678",
        confirmPassword: "12345678",
        });
        expect(result).toEqual({});
    });

    it("fails when password is empty", () => {
        const result = validateSignup({
        ...validInput,
        password: "",
        confirmPassword: "",
        });
        expect(result).toEqual({ password: "Password too short" });
    });

    /* ------------------------
        Password Match
    -------------------------*/
    it("fails when passwords do not match", () => {
        const result = validateSignup({
        ...validInput,
        confirmPassword: "differentPassword",
        });
        expect(result).toEqual({ confirmPassword: "Passwords do not match" });
    });

    it("does not return confirm error if both passwords are empty (only length error)", () => {
        const result = validateSignup({
        ...validInput,
        password: "",
        confirmPassword: "",
        });
        expect(result).toEqual({ password: "Password too short" });
    });

    it("fails when confirmPassword is empty but password is valid", () => {
        const result = validateSignup({
        ...validInput,
        confirmPassword: "",
        });
        expect(result).toEqual({ confirmPassword: "Passwords do not match" });
    });

    /* ------------------------
        Multiple Errors Together
    -------------------------*/
    it("returns all errors when every field is invalid", () => {
        const result = validateSignup({
        name: "",
        email: "test@gmail.com",
        password: "123",
        confirmPassword: "456",
        });

        expect(result).toEqual({
        name: "Name field was empty",
        email: "Email domain is not valid",
        password: "Password too short",
        confirmPassword: "Passwords do not match",
        });
    });

    it("returns partial errors correctly", () => {
        const result = validateSignup({
        name: "Tester",
        email: "bad@email.com",
        password: "password123",
        confirmPassword: "wrong",
        });

        expect(result).toEqual({
        email: "Email domain is not valid",
        confirmPassword: "Passwords do not match",
        });
    });
});

// unit test validate signin
describe("validateSignin", () => {

    const validInput = {
        email: "test@umanitoba.ca",
        password: "password123",
    };

    /* ------------------------
        Fully Valid Case
    -------------------------*/
    it("returns empty object when input is fully valid", () => {
        expect(validateSignin(validInput)).toEqual({});
    });

    /* ------------------------
        Email Validation
    -------------------------*/
    it("fails when email is empty", () => {
        const result = validateSignin({ ...validInput, email: "" });
        expect(result).toEqual({ email: "Email required" });
    });

    it("fails when email is whitespace only", () => {
        const result = validateSignin({ ...validInput, email: "   " });
        expect(result).toEqual({ email: "Email required" });
    });

    it("passes when email has surrounding spaces", () => {
        const result = validateSignin({ ...validInput, email: "  test@umanitoba.ca  " });
        expect(result).toEqual({});
    });

    /* ------------------------
        Password Validation
    -------------------------*/
    it("fails when password is empty", () => {
        const result = validateSignin({ ...validInput, password: "" });
        expect(result).toEqual({ password: "Password required" });
    });

    it("fails when password is whitespace only", () => {
        const result = validateSignin({ ...validInput, password: "   " });
        expect(result).toEqual({ password: "Password required" });
    });

    it("passes when password has surrounding spaces", () => {
        const result = validateSignin({ ...validInput, password: "  password123  " });
        expect(result).toEqual({});
    });

    /* ------------------------
        Multiple Errors Together
    -------------------------*/
    it("returns both errors when both fields are invalid", () => {
        const result = validateSignin({
            email: "",
            password: "",
        });

        expect(result).toEqual({
            email: "Email required",
            password: "Password required",
        });
    });

    it("returns partial errors correctly", () => {
        const result = validateSignin({
            email: "",
            password: "password123",
        });

        expect(result).toEqual({
            email: "Email required",
        });
    });
});