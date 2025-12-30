"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReassignModal from "../components/ReassignModal";
import { api } from "../../lib/api";
import { Post, ApiResponse } from "../../types";
import {
    Building2, ShieldCheck, Loader2, MapPin,
    Settings2, X, Filter, Search
} from "lucide-react";

// Using a wrapper to handle useSearchParams in Next.js Client Components
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

    // 1. Extract the filter ID from the URL
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

    // 2. Multi-tier Filtering (URL Filter + Search Bar)
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.client?.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClient = clientFilterId
                ? String(post.clientId) === clientFilterId
                : true;

            return matchesSearch && matchesClient;
        });
    }, [posts, searchQuery, clientFilterId]);

    const clearFilter = () => router.push('/posts');

    // Get the client name for the filter badge
    const activeClientLabel = filteredPosts.length > 0 && clientFilterId
        ? filteredPosts[0].client?.name
        : "Selected Client";

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
                    {/* Search Input */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find site..."
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase w-48 outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
                        />
                    </div>
                    <div className="bg-[#0B1E3D] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-900/20">
                        {filteredPosts.length} Active Sites
                    </div>
                </div>
            </header>

            {/* --- CONTENT GRID --- */}
            <main className="p-8">
                {/* Active Filter Badge */}
                {clientFilterId && (
                    <div className="mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <div className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 italic uppercase">
                            <Filter size={10} />
                            Viewing Sites for: {activeClientLabel}
                            <button
                                onClick={clearFilter}
                                className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors text-blue-900"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-red-600" size={32} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Network...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredPosts.map((post) => {
                            const displayId = String(post.id).padStart(3, '0');

                            return (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[180px] group transition-all duration-300 hover:shadow-xl hover:border-red-500/50 overflow-hidden"
                                >
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

                                        <div className="flex items-center gap-1 text-slate-400 mb-4">
                                            <MapPin size={10} />
                                            <span className="text-[9px] font-bold uppercase truncate">{post.location || "No Location"}</span>
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => setSelectedPost(post)}
                                                className="w-full py-2.5 bg-[#0B1E3D] hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-900/10"
                                            >
                                                <Settings2 size={12} />
                                                Configure Site
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredPosts.length === 0 && (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">No matching deployment sites found</p>
                                {clientFilterId && (
                                    <button onClick={clearFilter} className="mt-2 text-blue-600 text-[10px] font-black uppercase underline decoration-2 underline-offset-4">
                                        View All Sites
                                    </button>
                                )}
                            </div>
                        )}
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