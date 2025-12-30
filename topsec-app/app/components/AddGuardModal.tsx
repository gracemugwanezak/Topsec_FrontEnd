"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";

interface Guard {
    id: number;
    name: string;
}

// Interface for API wrapping if your backend uses { data: [...] }
interface GuardResponse {
    data?: Guard[];
}

export default function AddGuardModal({
    postId,
    onClose,
    onRefresh
}: {
    postId: number,
    onClose: () => void,
    onRefresh: () => void
}) {
    const [guards, setGuards] = useState<Guard[]>([]);
    const [selectedGuard, setSelectedGuard] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchGuards = async () => {
            try {
                // Fetch as unknown to handle potential wrapping safely
                const res = await api.get<unknown>("/guards");

                // Extraction logic that handles both [guards] and { data: [guards] }
                if (Array.isArray(res)) {
                    setGuards(res as Guard[]);
                } else {
                    const wrapped = res as GuardResponse;
                    if (wrapped && Array.isArray(wrapped.data)) {
                        setGuards(wrapped.data);
                    }
                }
            } catch (err) {
                console.error("Failed to load guards:", err);
            }
        };

        fetchGuards();
    }, []);

    const handleAssign = async () => {
        if (!selectedGuard) return;
        setIsLoading(true);
        try {
            await api.post(`/posts/${postId}/guards/${selectedGuard}`, {});
            onRefresh();
            onClose();
        } catch (err) {
            alert("Guard assignment failed or already assigned to this site.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#1A2A4A] uppercase italic tracking-tight">Deploy Personnel</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Assigning to Station #{postId}</p>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Security Officer</label>
                    <select
                        className="w-full p-4 border-2 border-slate-100 rounded-2xl mb-6 text-black font-bold focus:border-blue-500 outline-none transition-all appearance-none bg-slate-50"
                        value={selectedGuard}
                        onChange={(e) => setSelectedGuard(e.target.value)}
                    >
                        <option value="">Choose available guard...</option>
                        {guards.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedGuard || isLoading}
                        className="flex-1 py-4 bg-blue-600 disabled:bg-slate-200 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        {isLoading ? "DEPLOYING..." : "CONFIRM DEPLOY"}
                    </button>
                </div>
            </div>
        </div>
    );
}