"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReassignModal from "../components/ReassignModal";
import { api } from "../../lib/api";
import { Post, ApiResponse } from "../../types";
import { Building2, ShieldCheck, Loader2, MapPin, Settings2 } from "lucide-react";

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get<ApiResponse<Post[]> | Post[]>("/posts");
            const actualData = Array.isArray(res) ? res : (res as ApiResponse<Post[]>).data;
            setPosts(Array.isArray(actualData) ? actualData : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    return (
        <div className="flex flex-col min-h-full">
            {/* --- HEADER --- */}
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <ShieldCheck className="text-red-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#0B1E3D] uppercase italic tracking-tighter leading-none">
                            Deployment <span className="text-red-600">Posts</span>
                        </h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Site Inventory</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#0B1E3D] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-900/20">
                        {posts.length} Active Sites
                    </div>
                </div>
            </header>

            {/* --- CONTENT GRID --- */}
            <main className="p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-red-600" size={32} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Network...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {posts.map((post) => {
                            const displayId = String(post.id).padStart(3, '0');

                            return (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[180px] group transition-all duration-300 hover:shadow-xl hover:border-red-500/50 overflow-hidden"
                                >
                                    {/* Visual Brand Bar */}
                                    <div className="h-1 w-full bg-[#0B1E3D] group-hover:bg-red-600 transition-colors" />

                                    <div className="p-4 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-1.5 text-blue-800">
                                                <Building2 size={12} className="opacity-70" />
                                                <span className="text-[9px] font-black uppercase tracking-tighter italic truncate max-w-[120px]">
                                                    {post.client?.name || "Independent"}
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-300">#{displayId}</span>
                                        </div>

                                        <h2 className="text-base font-black text-[#0B1E3D] italic uppercase leading-[1.1] tracking-tight mb-auto line-clamp-2">
                                            {post.title}
                                        </h2>

                                        {/* Stats/Action Area */}
                                        <div className="mt-4 flex gap-2 items-center">
                                            <button
                                                onClick={() => setSelectedPost(post)}
                                                className="flex-1 py-2.5 bg-[#0B1E3D] hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-900/10"
                                            >
                                                <Settings2 size={12} />
                                                Configure Site
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* --- MODAL --- */}
            {selectedPost && (
                <ReassignModal
                    post={selectedPost}
                    guard={null}
                    onClose={() => setSelectedPost(null)}
                    onSuccess={fetchPosts}
                />
            )}
        </div>
    );
}