"use client";

import React, { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import axios from "axios"; // 1. Import axios for type checking

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Sending 'pass' to match your updated AuthService
            await api.post("/auth/register", { email, pass: password });
            alert("Success! Please log in.");
            router.push("/login");
        } catch (err: unknown) { // 2. Change 'any' to 'unknown'
            let message = "Registration failed. Check backend console.";

            // 3. Use Type Guard to safely access axios error properties
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
            } else if (err instanceof Error) {
                message = err.message;
            }

            alert(`Error: ${message}`);
            console.error("Registration Error:", err);
        }
    };

    return (
        <div className="h-screen bg-[#0B1E3D] flex items-center justify-center p-4">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 uppercase italic">Register Personnel</h2>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-3 border rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-3 border rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded font-bold uppercase hover:bg-blue-700 transition-colors"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
}