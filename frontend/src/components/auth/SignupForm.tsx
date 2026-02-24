import { useState } from "react";
import { Button } from "../ui/button";

export default function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onSignup = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Signup Submitted", {name, email, password, confirmPassword});
    }
    
    return (
        <form className="flex flex-col gap-4" onSubmit={onSignup}>
            <input 
                type="text" 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                required
            />
            <div className="flex flex-col gap-0">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                    required
                />

                <p className="font-instrument text-xs pl-1 text-secondary italic">
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

                <p className="font-instrument text-xs pl-1 text-secondary italic">
                    Password must be at least 8 characters long
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

                <p className="font-instrument text-xs pl-1 text-secondary italic">
                    Passwords must match
                </p>
            </div>

            <Button 
                type="submit"
                variant="outline"
                className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer"
            >
                Create Account
            </Button>
        </form>
    );
}