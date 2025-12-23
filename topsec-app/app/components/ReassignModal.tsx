"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Post, Guard } from "../../types";
import { Loader2, ShieldCheck, UserCheck, X } from "lucide-react";

interface ReassignModalProps {
    post: Post | null;      // Added this to fix the TS error
    guard: Guard | null;    // Kept for backward compatibility
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReassignModal({ post, guard: initialGuard, onClose, onSuccess }: ReassignModalProps) {
    const [availableGuards, setAvailableGuards] = useState<Guard[]>([]);
    const [selectedGuardId, setSelectedGuardId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);

    useEffect(() => {
        const fetchGuards = async () => {
            try {
                setFetching(true);
                // Fetching personnel instead of posts since we already have the post
                const res = await api.get<Guard[]>("/guards");
                const data = Array.isArray(res) ? res : (res as unknown as { data: Guard[] }).data;
                setAvailableGuards(data || []);
            } catch (err) {
                console.error("Failed to fetch guards");
            } finally {
                setFetching(false);
            }
        };
        fetchGuards();
    }, []);

    const handleAction = async () => {
        if (!selectedGuardId || !post) return;
        setLoading(true);
        try {
            // Updated endpoint logic: Assigning a Guard to this Post
            await api.patch(`/posts/${post.id}/assign`, { guardId: selectedGuardId });
            onSuccess();
            onClose();
        } catch (err) {
            alert("Deployment failed.");
        } finally {
            setLoading(false);
        }
    };

    if (!post) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B1E3D]/80 backdrop-blur-sm p-4 text-slate-900">
            <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-md shadow-2xl border border-slate-200">
                {/* Brand Header */}
                <div className="bg-[#0B1E3D] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-red-500" size={20} />
                        <h2 className="text-sm font-black uppercase italic tracking-tighter">
                            Site <span className="text-red-500">Assignment</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {/* Active Site Context */}
                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Active Post</p>
                        <p className="text-lg font-black text-[#0B1E3D] uppercase italic leading-tight">{post.title}</p>
                        <p className="text-[10px] font-bold text-red-600 uppercase mt-1">Client: {post.client?.name}</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                                Select Personnel to Deploy
                            </label>
                            {fetching ? (
                                <div className="flex items-center justify-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Loader2 className="animate-spin text-red-600" size={16} />
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-black outline-none focus:ring-2 focus:ring-red-600/20 appearance-none uppercase italic transition-all cursor-pointer pr-10"
                                        value={selectedGuardId}
                                        onChange={(e) => setSelectedGuardId(e.target.value)}
                                    >
                                        <option value="">Choose Guard...</option>
                                        {availableGuards.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name} {g.posts && g.posts.length > 0 ? `(Currently at ${g.posts[0].title})` : "(Unassigned)"}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <UserCheck size={16} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-red-600 transition-colors"
                            >
                                Abort
                            </button>
                            <button
                                disabled={!selectedGuardId || loading}
                                onClick={handleAction}
                                className="flex-[2] bg-[#0B1E3D] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10"
                            >
                                {loading ? <Loader2 className="animate-spin" size={14} /> : "Authorize Deployment"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}