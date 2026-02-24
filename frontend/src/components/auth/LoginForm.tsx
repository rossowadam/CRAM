import { useState } from "react";
import { Button } from "../ui/button";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Login Submitted", {email, password});
    }

    return (
        <form 
            className="flex flex-col gap-4"
            onSubmit={onLogin}
        >
            <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-funnel font-thin border-2 border-foreground rounded-sm p-1"
                required
            />

            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="font-funnel font-thin border-2 border-foreground rounded-sm p-1" 
                required
            />

            <Button 
                type="submit"
                variant="outline"
                className="font-bold text-foreground hover:text-secondary hover:bg-accent hover:cursor-pointer"
            >
                Login
            </Button>
        </form>
    );
}