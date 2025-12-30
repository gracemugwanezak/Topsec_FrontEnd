"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Post, Guard, Client } from "../../types";
import { Loader2, ShieldCheck, X, Sun, Moon, Calendar, Building2, UserCircle2 } from "lucide-react";

interface ReassignModalProps {
    guard: Guard | null;
    post?: Post | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReassignModal({ guard: initialGuard, post: initialPost, onClose, onSuccess }: ReassignModalProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [allGuards, setAllGuards] = useState<Guard[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    const [selectedClientId, setSelectedClientId] = useState<string>(initialPost?.clientId.toString() || "");
    const [selectedPostId, setSelectedPostId] = useState<string>(initialPost?.id.toString() || "");
    const [selectedGuardId, setSelectedGuardId] = useState<string>(initialGuard?.id.toString() || "");

    const [shift, setShift] = useState<"DAY" | "NIGHT">("DAY");
    const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequiredData = async () => {
            try {
                setFetching(true);
                const [clientsRes, postsRes, guardsRes] = await Promise.all([
                    api.get("/clients"),
                    api.get("/posts"),
                    api.get("/guards")
                ]);

                setClients(Array.isArray(clientsRes) ? clientsRes : (clientsRes as any).data || []);
                setAllPosts(Array.isArray(postsRes) ? postsRes : (postsRes as any).data || []);
                setAllGuards(Array.isArray(guardsRes) ? guardsRes : (guardsRes as any).data || []);

                if (initialPost) {
                    setSelectedClientId(initialPost.clientId.toString());
                    setSelectedPostId(initialPost.id.toString());
                }
            } catch (err) {
                setErrorMsg("Critical: Failed to sync with deployment server.");
            } finally {
                setFetching(false);
            }
        };
        fetchRequiredData();
    }, [initialPost]);

    useEffect(() => {
        if (selectedClientId) {
            setFilteredPosts(allPosts.filter(p => p.clientId === Number(selectedClientId)));
        } else {
            setFilteredPosts([]);
        }
    }, [selectedClientId, allPosts]);

    const handleAction = async () => {
        const finalGuardId = selectedGuardId || initialGuard?.id;
        const finalPostId = selectedPostId || initialPost?.id;

        if (!finalPostId || !finalGuardId) {
            setErrorMsg("Missing guard or site selection.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            // FIXED API URL PATH
            await api.patch(`/guards/actions/reassign/${finalGuardId}/${finalPostId}`, {
                shift,
                startDate: effectiveDate
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Deployment Authorization Failed.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B1E3D]/90 backdrop-blur-md p-4">
            <div className="bg-white rounded-[2.5rem] overflow-hidden w-full max-w-md shadow-2xl border border-white/20">
                <div className="bg-[#0B1E3D] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-600 rounded-lg">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <h2 className="text-sm font-black uppercase italic tracking-tighter">
                            Deploy <span className="text-red-500">Personnel</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {fetching ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <Loader2 className="animate-spin text-red-600" size={24} />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fetching Personnel Data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {initialGuard ? (
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                            <UserCircle2 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Active Officer</p>
                                            <p className="text-xs font-black text-[#0B1E3D] uppercase italic">{initialGuard.name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">1. Select Guard</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-black uppercase outline-none focus:border-red-500 transition-all"
                                            value={selectedGuardId}
                                            onChange={(e) => setSelectedGuardId(e.target.value)}
                                        >
                                            <option value="">-- Choose Personnel --</option>
                                            {allGuards.map(g => (
                                                <option key={g.id} value={g.id}>
                                                    {g.name} (ID: {g.idNumber || "N/A"})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {!initialPost ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">2. Target Client</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-black uppercase outline-none"
                                                value={selectedClientId}
                                                onChange={(e) => {
                                                    setSelectedClientId(e.target.value);
                                                    setSelectedPostId("");
                                                }}
                                            >
                                                <option value="">-- Client --</option>
                                                {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                            </select>
                                        </div>
                                        <div className={`space-y-1 ${!selectedClientId ? 'opacity-40 pointer-events-none' : ''}`}>
                                            <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">3. Assign Site</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-black uppercase outline-none focus:border-blue-500"
                                                value={selectedPostId}
                                                onChange={(e) => setSelectedPostId(e.target.value)}
                                            >
                                                <option value="">-- Site --</option>
                                                {filteredPosts.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Target Deployment Site</p>
                                            <p className="text-xs font-black text-[#0B1E3D] uppercase italic">{initialPost.title}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Operational Shift</label>
                                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setShift("DAY")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black transition-all ${shift === "DAY" ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400'}`}
                                        >
                                            <Sun size={14} /> DAY
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShift("NIGHT")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black transition-all ${shift === "NIGHT" ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400'}`}
                                        >
                                            <Moon size={14} /> NIGHT
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Effective Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            type="date"
                                            value={effectiveDate}
                                            onChange={(e) => setEffectiveDate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-[10px] font-black text-[#0B1E3D] outline-none focus:border-red-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                                    <p className="text-[10px] font-black uppercase italic leading-tight">{errorMsg}</p>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">
                                    Cancel
                                </button>
                                <button
                                    disabled={loading || (!selectedPostId && !initialPost) || (!selectedGuardId && !initialGuard)}
                                    onClick={handleAction}
                                    className="flex-[2] bg-red-600 hover:bg-[#0B1E3D] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-red-600/20 disabled:opacity-20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Finalize Order"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}