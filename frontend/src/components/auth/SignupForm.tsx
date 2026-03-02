import { useState } from "react";
import { Button } from "../ui/button";

import { validateSignup } from "@/utils/validators";
import { createUser } from "@/api/userApi";
interface SignupFormProps {
    setOpen: (open: boolean) => void;
}

export default function SignupForm({ setOpen }: SignupFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // error messages to conditionally render hints in red if invalid
    const [errors, setErrors] = useState<{
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        }>({});

    const onSignup = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setServerError(null); // remove old errors

        console.log("Inputted Values", { name, email, password, confirmPassword });
        
        // validate fields and update errors oject
        const validationResults = validateSignup({ name, email, password, confirmPassword });
        setErrors(validationResults);

        // return if invalid when errors isn't empty
        if (Object.keys(validationResults).length > 0) {
            console.error(validationResults);
            return;
        }
        
        // valid signup, package details and send to backend
        console.log("Valid!");

        // try to create the error and display possible errors
        try {
            setLoading(true);

            await createUser({ name, email, password });
            
            setOpen(false); // close tab if ran successfully
        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={onSignup}>
            <div className="flex flex-col gap-0">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                    required
                />
                <p className={`font-instrument text-xs pl-1 italic ${errors.name ? "text-red-500" : "text-secondary"}`}>
                    Name must not be empty
                </p>
            </div>

            <div className="flex flex-col gap-0">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                    required
                />

                <p className={`font-instrument text-xs pl-1 italic ${errors.email ? "text-red-500" : "text-secondary"}`}>
                    Email must end in "@myumanitoba.ca" or "@umanitoba.ca"
                </p>
            </div>

            <div className="flex flex-col gap-0">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                    required
                />

                <p className={`font-instrument text-xs pl-1 italic ${errors.password ? "text-red-500" : "text-secondary"}`}>
                    Password must be at least 8 characters
                </p>
            </div>

            <div className="flex flex-col gap-0">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                    required
                />

                <p className={`font-instrument text-xs pl-1 italic ${errors.confirmPassword ? "text-red-500" : "text-secondary"}`}>
                    Passwords must match
                </p>
            </div>

            <Button
            type="submit"
            variant="outline"
            disabled={loading}
            className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer disabled:opacity-50"
            >
            {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {serverError && (
                <p className="text-red-500 text-sm text-center mt-2">
                    {serverError}
                </p>
            )}
        </form>
    );
}
