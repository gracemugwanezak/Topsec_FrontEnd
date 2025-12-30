"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ShieldPlus, X, Loader2 } from "lucide-react";

interface AddPostModalProps {
    clientId: number;
    clientName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPostModal({ clientId, clientName, onClose, onSuccess }: AddPostModalProps) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    // Allow closing with Escape key and saving with Enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && title.trim() && !loading) handleCreate();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [title, loading]);

    const handleCreate = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            await api.post("/posts", {
                title: title.toUpperCase().trim(),
                content: "ACTIVE DEPLOYMENT",
                clientId
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Creation failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0B1E3D]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[380px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
                {/* Header Section */}
                <div className="bg-[#0B1E3D] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-600 rounded-lg">
                            <ShieldPlus size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] leading-none">New Deployment</p>
                            <h2 className="text-lg font-black uppercase italic tracking-tighter mt-1 truncate">
                                {clientName}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">
                        Site Designation / Post Title
                    </label>
                    <input
                        autoFocus
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl text-xs font-black text-[#0B1E3D] mb-6 outline-none focus:border-red-600 transition-all placeholder:text-slate-300"
                        placeholder="E.G. MAIN GATE / NORTH WING"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleCreate}
                            disabled={!title.trim() || loading}
                            className="w-full bg-[#0B1E3D] hover:bg-red-600 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Initialising...
                                </>
                            ) : (
                                "Confirm Deployment"
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="py-2 text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                        >
                            Cancel Request
                        </button>
                    </div>
                </div>

                {/* Footer Deco */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-[#0B1E3D] to-red-600" />
            </div>
        </div>
    );
}