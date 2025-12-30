"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Post, Guard, Client } from "../../types";
import { Loader2, ShieldCheck, X, AlertCircle, Clock } from "lucide-react";

interface ReassignModalProps {
    guard: Guard | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReassignModal({ guard: initialGuard, onClose, onSuccess }: ReassignModalProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [selectedPostId, setSelectedPostId] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchDeploymentData = async () => {
            try {
                setFetching(true);
                const [clientsRes, postsRes] = await Promise.all([
                    api.get("/clients"),
                    api.get("/posts")
                ]);

                const clientsData = Array.isArray(clientsRes) ? clientsRes : (clientsRes as any).data || [];
                const postsData = Array.isArray(postsRes) ? postsRes : (postsRes as any).data || [];

                setClients(clientsData);
                setAllPosts(postsData);
            } catch (err) {
                setErrorMsg("Failed to synchronize server data.");
            } finally {
                setFetching(false);
            }
        };
        fetchDeploymentData();
    }, []);

    // Filter Posts when Client selection changes
    useEffect(() => {
        if (selectedClientId) {
            const filtered = allPosts.filter(p => p.clientId === Number(selectedClientId));
            setFilteredPosts(filtered);
            setSelectedPostId("");
        } else {
            setFilteredPosts([]);
        }
    }, [selectedClientId, allPosts]);

    const handleAction = async () => {
        if (!selectedPostId || !initialGuard?.id) {
            setErrorMsg("Selection incomplete.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const gId = initialGuard.id;
            const pId = Number(selectedPostId);
            await api.patch(`/guards/actions/reassign/${gId}/${pId}`);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Server Error Details:", err.response?.data);
            setErrorMsg(err.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B1E3D]/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-md shadow-2xl border border-slate-200">
                {/* Header Section */}
                <div className="bg-[#0B1E3D] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-amber-500" size={20} />
                        <h2 className="text-sm font-black uppercase italic tracking-tighter">
                            Authorize <span className="text-amber-500">Deployment</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-5">
                    {/* Guard Identity Badge with Current Deployment & Timestamp */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1 italic">Officer Identity</p>
                                <p className="text-md font-black text-[#0B1E3D] uppercase italic leading-tight">{initialGuard?.name || "Unknown Officer"}</p>
                                <p className="text-[10px] font-bold text-amber-600">NAT-ID: {initialGuard?.idNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1 italic">Current Post</p>
                                {initialGuard?.posts && initialGuard.posts.length > 0 ? (
                                    <>
                                        <p className="text-[10px] font-black text-slate-600 uppercase italic leading-none">
                                            {initialGuard.posts[0].post.client?.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase italic">
                                            {initialGuard.posts[0].post.title}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-[10px] font-bold text-slate-300 uppercase italic leading-none pt-1">Unassigned</p>
                                )}
                            </div>
                        </div>

                        {/* Timestamp Footer */}
                        <div className="flex items-center gap-1.5 border-t border-slate-200 mt-2 pt-2">
                            <Clock size={10} className="text-slate-300" />
                            <span className="text-[8px] text-slate-400 font-bold uppercase italic tracking-tight">
                                File Last Updated: {initialGuard?.updatedAt ? new Date(initialGuard.updatedAt).toLocaleString() : 'Never'}
                            </span>
                        </div>
                    </div>

                    {/* Error Feedback */}
                    {errorMsg && (
                        <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase italic">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {fetching ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-2">
                            <Loader2 className="animate-spin text-amber-500" />
                            <span className="text-[10px] font-black uppercase text-slate-400 italic">Syncing Post Data...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Client Dropdown */}
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic px-1">1. Select Target Client</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-black uppercase italic outline-none focus:ring-2 focus:ring-amber-500/20"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                >
                                    <option value="">-- Choose Client --</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Post/Site Dropdown */}
                            <div className={!selectedClientId ? 'opacity-40 pointer-events-none' : ''}>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic px-1">2. Assign New Site</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-black uppercase italic outline-none focus:ring-2 focus:ring-amber-500/20"
                                    value={selectedPostId}
                                    onChange={(e) => setSelectedPostId(e.target.value)}
                                >
                                    <option value="">-- Choose Site --</option>
                                    {filteredPosts.map((p) => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Abort
                        </button>
                        <button
                            disabled={!selectedPostId || loading}
                            onClick={handleAction}
                            className="flex-[2] bg-[#0B1E3D] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                        >
                            {loading ? <Loader2 className="animate-spin" size={14} /> : "Finalize Deployment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}