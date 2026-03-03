import { createContext, useContext, useEffect, useState } from "react";

// what session cookie has
interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean; // signed in
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user; // clear false

    // check session on first load
    useEffect(() => {
        fetch("http://localhost:5000/api/me", {
        credentials: "include",
        })
        .then(res => {
            if (!res.ok) throw new Error("unauthenticated");
            return res.json();
        })
        .then(data => setUser(data))
        .catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}