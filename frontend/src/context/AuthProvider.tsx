import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/userApi";
import { AuthContext, type User } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user; // clear false

    // check session on first load
    useEffect(() => {
        getCurrentUser()
        .then((u) => setUser(u))
        .catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}