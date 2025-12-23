"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "HR" | "OPERATIONS";
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    }, [router]);

    useEffect(() => {
        
        const syncAuth = () => {
            try {
                const savedUser = localStorage.getItem("user");
                const token = localStorage.getItem("token");

                // VALIDATION: Ensure data isn't null or the literal string "undefined"
                if (token && savedUser && savedUser !== "undefined" && savedUser !== "null") {
                    const parsed = JSON.parse(savedUser);
                    setUser(parsed);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error("Auth sync error recovery:", e);
                // Wipe the mess if JSON.parse fails
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        syncAuth();
    }, []);

    return {
        user,
        role: user?.role,
        loading,
        isAuthenticated: !!user,
        logout
    };
}