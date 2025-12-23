"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";

interface AddPostModalProps {
    clientId: number;
    clientName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPostModal({ clientId, clientName, onClose, onSuccess }: AddPostModalProps) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) return;
        setLoading(true);
        try {
            await api.post("/posts", {
                title: title.toUpperCase(),
                content: "ACTIVE DEPLOYMENT",
                clientId
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[340px] rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Deployment</p>
                <h2 className="text-xl font-black text-[#0F172A] uppercase italic mb-6">New Site: {clientName}</h2>

                <input
                    autoFocus
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs font-bold text-[#0F172A] mb-6 outline-none focus:ring-2 focus:ring-[#0F172A]"
                    placeholder="E.G. MAIN GATE"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleCreate}
                        disabled={!title || loading}
                        className="bg-[#0F172A] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-20"
                    >
                        {loading ? "SAVING..." : "CONFIRM POST"}
                    </button>
                    <button onClick={onClose} className="py-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">Cancel</button>
                </div>
            </div>
        </div>
    );
}