"use client";

import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

interface Post {
    id: number;
    title: string;
    guards?: { guard: { name: string } }[];
}

export default function Dashboard() {
    const { user, loading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [dbError, setDbError] = useState(false);

    const fetchData = useCallback(async () => {
        if (loading || !user) return;
        try {
            setIsSyncing(true);
            setDbError(false);
            const data = await api.get<Post[]>("/posts");
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setDbError(true);
        } finally {
            setIsSyncing(false);
        }
    }, [loading, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="h-screen bg-[#0B1E3D] flex items-center justify-center text-white font-mono">AUTHENTICATING...</div>;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA]">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">TopSec Dashboard</h1>
                        <p className="text-xs text-gray-500">Live Operations Feed</p>
                    </div>
                    {dbError && <span className="text-red-500 text-xs font-bold animate-pulse">BACKEND OFFLINE (PORT 3000)</span>}
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className="p-5 bg-white shadow-sm rounded-2xl border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4">{post.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.guards?.map((pg, i) => (
                                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-100">
                                                🛡️ {pg.guard.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
                                {isSyncing ? "Connecting to Command Center..." : "No active deployments found on the server."}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}