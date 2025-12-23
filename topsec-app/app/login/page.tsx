/*"use client";
import React, { useState } from "react";
import { api } from "../../lib/api";



// Define exactly what a User looks like
interface UserProfile {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "USER"; // Strict roles
}

// Define the exact shape the Backend SHOULD return
interface LoginResponse {
    access_token: string;
    user: UserProfile;
}

// 3. Define the Error structure for the catch block
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Use the <LoginResponse> generic to type the 'data' variable
            const data = await api.post<LoginResponse>("/auth/login", {
                email,
                pass
            });

            // Validation check (data is now strictly typed)
            console.log("DEBUG: Received from server ->", data);
            if (data && data.access_token && data.user) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/dashboard";
            } else {
                throw new Error("Invalid response structure from server.");
            }
        } catch (err) {
            const apiError = err as ApiError; // Type-cast the error
            console.error("Login Error:", apiError);
            setError(apiError.response?.data?.message || "Authentication Failed");
        }
    };

    return (
        <div className="h-screen bg-[#0B1E3D] flex items-center justify-center p-6">
            <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl">
                <h2 className="text-2xl font-black italic uppercase text-[#0B1E3D] mb-6 tracking-tighter">
                    TopSec <span className="text-blue-600">Login</span>
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 border border-red-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Operator Credentials</label>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Security Passphrase</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all mt-4"
                    >
                        Initialize Session
                    </button>
                </div>
            </form>
        </div>
    );
}*/