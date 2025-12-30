"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReassignModal from "../components/ReassignModal";
import { api } from "../../lib/api";
import { Post, ApiResponse } from "../../types";
import {
    ShieldCheck, Loader2, MapPin,
    Settings2, X, Filter, Search, Sun, Moon,
    Users, Phone
} from "lucide-react";

export default function PostsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
        }>
            <PostsContent />
        </Suspense>
    );
}

function PostsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientFilterId = searchParams.get("clientId");

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
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

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.client?.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClient = clientFilterId ? String(post.clientId) === clientFilterId : true;
            return matchesSearch && matchesClient;
        });
    }, [posts, searchQuery, clientFilterId]);

    const clearFilter = () => router.push('/posts');

    const activeClientLabel = filteredPosts.length > 0 && clientFilterId
        ? filteredPosts[0].client?.name
        : "Selected Client";

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50">
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <ShieldCheck className="text-red-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#0B1E3D] uppercase italic tracking-tighter leading-none">
                            Deployment <span className="text-red-600">Posts</span>
                        </h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel Distribution Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by site or client..."
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase w-64 outline-none focus:ring-2 focus:ring-[#FFB800]/20 transition-all"
                        />
                    </div>
                    <div className="bg-[#0B1E3D] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                        <Users size={12} className="text-blue-400" />
                        {filteredPosts.length} Live Sites
                    </div>
                </div>
            </header>

            <main className="p-8">
                {clientFilterId && (
                    <div className="mb-6 flex items-center gap-2">
                        <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 italic uppercase">
                            <Filter size={10} />
                            Viewing Sites for: {activeClientLabel}
                            <button onClick={clearFilter} className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors">
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-red-600" size={32} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updating Site Map...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredPosts.map((post) => {
                            const displayId = String(post.id).padStart(3, '0');
                            const dayGuards = post.guards?.filter(g => g.shift === "DAY") || [];
                            const nightGuards = post.guards?.filter(g => g.shift === "NIGHT") || [];

                            return (
                                <div key={post.id} className="bg-white rounded-3xl border border-slate-200 flex flex-col h-[280px] group transition-all duration-300 hover:shadow-xl hover:border-[#FFB800]/50 relative">
                                    <div className="p-4 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[8px] font-black text-blue-600 uppercase truncate max-w-[100px]">
                                                {post.client?.name || "Independent"}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-300">#{displayId}</span>
                                        </div>

                                        <h2 className="text-xs font-black text-[#0B1E3D] italic uppercase leading-tight truncate mb-1">
                                            {post.title}
                                        </h2>

                                        <div className="flex items-center gap-1 text-slate-400 mb-3">
                                            <MapPin size={10} />
                                            <span className="text-[8px] font-bold uppercase truncate">{post.location || "Sector Unmapped"}</span>
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 gap-2 mb-3">
                                            {[
                                                { guards: dayGuards, icon: <Sun size={10} className="text-orange-500" />, label: "Day Ops" },
                                                { guards: nightGuards, icon: <Moon size={10} className="text-blue-900" />, label: "Night Ops" }
                                            ].map((shiftInfo, idx) => (
                                                <div key={idx} className="bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {shiftInfo.icon}
                                                        <span className="text-[7px] font-black text-slate-400 uppercase">{shiftInfo.label}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {shiftInfo.guards.length > 0 ? (
                                                            shiftInfo.guards.map((pg) => (
                                                                <div key={pg.guardId} className="group/item relative">
                                                                    <div className="text-[8.5px] font-black text-slate-700 leading-tight bg-white px-1.5 py-1 rounded border border-slate-100 truncate cursor-help hover:border-red-500 hover:text-red-600 transition-colors">
                                                                        {pg.guard.name}
                                                                    </div>

                                                                    {/* UPDATED TOOLTIP FIX */}
                                                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/item:flex flex-col items-start z-[50] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                                                                        <div className="bg-[#0B1E3D] text-white p-3 rounded-xl shadow-2xl border border-white/10 min-w-[170px]">
                                                                            <p className="text-[6px] text-blue-400 font-black uppercase tracking-widest mb-1">Personnel Verified</p>
                                                                            <p className="text-[10px] font-black uppercase whitespace-nowrap italic">{pg.guard.name}</p>
                                                                            <div className="h-px bg-white/10 my-1.5" />
                                                                            <div className="space-y-1.5">
                                                                                <p className="text-[8px] font-bold text-slate-400 flex justify-between">
                                                                                    ID: <span className="text-white font-black">{pg.guard.idNumber || "N/A"}</span>
                                                                                </p>
                                                                                <p className="text-[8px] font-bold text-slate-400 flex justify-between gap-4">
                                                                                    CONTACT: <span className="text-blue-400 font-black flex items-center gap-1 truncate">
                                                                                        <Phone size={8} /> {pg.guard.phoneNumber || "No Contact"}
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="w-2 h-2 bg-[#0B1E3D] rotate-45 ml-4 -mt-1 border-r border-b border-white/10" />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-[7px] text-slate-300 italic">Unmapped</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setSelectedPost(post)}
                                            className="w-full py-2.5 bg-[#FFB800] hover:bg-[#E6A600] text-[#0B1E3D] rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Settings2 size={12} />
                                            Manage Personnel
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {selectedPost && (
                <ReassignModal
                    guard={null}
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onSuccess={fetchPosts}
                />
            )}
        </div>
    );
}