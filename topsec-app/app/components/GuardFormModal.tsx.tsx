"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Guard } from "../../types";
import { Loader2, UserPlus, X, AlertCircle } from "lucide-react";

interface GuardFormModalProps {
    guard: Guard | null;
    onClose: () => void;
    onSuccess: () => void;
}

// 🛡️ We define the shape of the error instead of using 'any'
interface ApiError {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
}

export default function GuardFormModal({ guard, onClose, onSuccess }: GuardFormModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        idNumber: "",
        phoneNumber: "",
        homeResidence: "",
    });

    useEffect(() => {
        if (guard) {
            setFormData({
                name: guard.name || "",
                idNumber: guard.idNumber || "",
                phoneNumber: guard.phoneNumber || "",
                homeResidence: guard.homeResidence || "",
            });
        }
    }, [guard]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (guard) {
                await api.patch(`/guards/${guard.id}`, formData);
            } else {
                await api.post("/guards", formData);
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            // 🛡️ Safe type casting: check if it's an error we recognize
            const serverError = err as ApiError;
            const message = serverError.response?.data?.message || "Something went wrong";
            setError(Array.isArray(message) ? message[0] : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <div className="flex items-center gap-2 mb-6 text-slate-900">
                    <div className="p-2 bg-blue-50 rounded-lg"><UserPlus className="text-blue-600" size={20} /></div>
                    <h2 className="text-sm font-black uppercase italic tracking-tighter">
                        {guard ? "Edit Personnel" : "Register New Guard"}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-xl flex items-center gap-2">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        placeholder="Full Name"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {/* ... other inputs following same pattern ... */}
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                        <button
                            disabled={loading}
                            className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={14} /> : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}