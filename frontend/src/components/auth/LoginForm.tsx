import { useState } from "react";
import { Button } from "../ui/button";
import { validateSignin } from "@/utils/validators";
import { loginUser } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
    setOpen: (open: boolean) => void;
}

export default function LoginForm({ setOpen }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const { setUser } = useAuth();

    // error messages to conditionally render hints in red if invalid
    const [errors, setErrors] = useState<{
            email?: string;
            password?: string;
        }>({});

    const onLogin = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setServerError(null); // remove old errors

        console.log("Inputted Values", {email, password});

        // validate fields and update errors object
        const validationResults = validateSignin({ email, password });
        setErrors(validationResults);

        // return if invalid when errors isn't empty
        if (Object.keys(validationResults).length > 0) {
            console.error(validationResults);
            return;
        }

        // valid signup, package details and send to backend
        console.log("Valid!");

        // try to login and display proper errors
        try {
            setLoading(true);

            const user = await loginUser({ 
                email: email.trim().toLowerCase(),
                password
            })

            setUser(user);
            setOpen(false);
        } catch (err) {
            setServerError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form 
            className="flex flex-col gap-4"
            onSubmit={onLogin}
        >
            <div className="flex flex-col gap-0">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                    required
                />
                {errors.email && (
                    <p className="font-instrument text-xs pl-1 italic text-red-500">
                        {errors.email}
                    </p>
                )}
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
                {errors.password && (
                    <p className="font-instrument text-xs pl-1 italic text-red-500">
                        {errors.password}
                    </p>
                )}
            </div>

            <Button 
                type="submit"
                variant="outline"
                disabled={loading}
                className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer"
            >
                {loading ? "Logging in..." : "Login"}
            </Button>

            {serverError && (
                <p className="text-red-500 text-sm text-center mt-2">
                    {serverError}
                </p>
            )}
        </form>
    );
}