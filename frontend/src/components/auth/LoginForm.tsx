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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const [forgotPassword, setForgotPassword] = useState(false);

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

    const onForgotPassword = async (event: React.SyntheticEvent<HTMLFormElement>) => {

    }

    return (
        !forgotPassword ? (
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
                        <p className="font-instrument text-xs pl-1 italic text-destructive">
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
                        <p className="font-instrument text-xs pl-1 italic text-destructive">
                            {errors.password}
                        </p>
                    )}

                    <Button 
                    type="button"
                        className="justify-start font-bold text-foreground hover:text-secondary hover:cursor-pointer"
                        onClick={() => setForgotPassword(true)}
                    >
                        Forgot password?
                    </Button>
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
                    <p className="text-destructive text-sm text-center mt-2">
                        {serverError}
                    </p>
                )}
            </form>
        ) : (
            <form className="flex flex-col" onSubmit={onForgotPassword}>
                <div className="flex flex-col sm:p-2 gap-4 w-full">
                    <div>
                        <input
                            type="email"
                            placeholder="Enter new email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="font-funnel font-thin text-xs sm:text-sm bg-background text-foreground border border-foreground rounded-md p-2 w-full"
                            required
                        />
                        {/* Email requires domain check */}
                        <p className={`text-xs font-funnel italic gap-0 ${
                            (email.length > 0 && !email.endsWith("@myumanitoba.ca") && !email.endsWith("@umanitoba.ca")) ? "text-destructive" : "text-secondary"
                        }`}>
                            Email must end in "@myumanitoba.ca" or "@umanitoba.ca"
                        </p>
                    </div>

                    <Button
                        type="submit"
                        variant="outline"
                        disabled={loading}
                        className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer disabled:opacity-50"
                        onClick={() => setForgotPassword(false)}
                    >
                        Back to Login
                    </Button>

                    {serverError && (
                        <p className="text-destructive text-sm text-center mt-2">
                            {serverError}
                        </p>
                    )}

                    {successMessage && (
                        <p className="text-green-600 text-sm text-center mt-2">
                            {successMessage}
                        </p>
                    )}
                </div>
            </form>
        )
    )
};