import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { Link } from "react-router-dom"
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const { user, isAuthenticated, setUser } = useAuth();

    const maxChars = 25;

    // truncate display 
    const displayEmail = 
        user?.email && user.email.length > maxChars
        ? user.email.slice(0, maxChars) + "..."
        : user?.email;

    return (
        <>
            <nav 
                aria-label="Navigation Bar"
                className="w-full border-b bg-background shadow-2xl"
            >
            <div className="w-full sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto flex flex-row items-center justify-between px-4 py-3 ">
                <Link 
                    to="/" 
                    className="font-semibold font-funnel text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl text-secondary"
                >
                C.R.A.M.
                </Link>

                <div className="flex gap-6 font-instrument text-foreground text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
                {isAuthenticated ? (
                    <Button
                        className="hover:text-secondary hover:cursor-pointer"
                        onClick={() => {
                            console.log("Logout desired!");
                            setUser(null);
                        }}
                    >
                        Logout {displayEmail}
                    </Button>
                ): (
                    <Button 
                        className="hover:text-secondary hover:cursor-pointer"
                        onClick={() => {
                            setAuthMode('login');
                            setAuthOpen(true);
                        }}
                    >
                        Login
                    </Button>
                )} 
                </div>
            </div>
            </nav>

            <AuthDialog
                open={authOpen}
                mode={authMode}
                setOpen={setAuthOpen}
                setMode={setAuthMode}
            />
        </>
    )
}

export default Navbar;