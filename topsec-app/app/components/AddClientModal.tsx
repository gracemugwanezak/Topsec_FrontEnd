"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";

export default function AddClientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    // Get today's date in YYYY-MM-DD format for the 'min' attribute
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: "",
        contractStart: today,
        contractEnd: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // FIX: Ensure dates are handled as clean local dates before converting to ISO
            // This prevents the '+02' timezone offset from corrupting the year string
            const start = new Date(formData.contractStart);
            const end = new Date(formData.contractEnd);

            // Validation check
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                alert("Please select valid dates for the contract.");
                return;
            }

            await api.post("/clients", {
                ...formData,
                contractStart: start.toISOString(),
                contractEnd: end.toISOString(),
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Creation failed. Ensure backend Prisma is updated!", err);
            alert("Failed to add client. Check the console for errors.");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[400px] rounded-[3rem] p-10 shadow-2xl border border-gray-100">
                <header className="mb-8">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Onboarding</span>
                    <h2 className="text-2xl font-black text-[#0F172A] uppercase italic leading-none mt-1">New Client</h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-3">Client Name</label>
                        <input
                            required
                            placeholder="E.G. REG ELECTRIC"
                            className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold uppercase outline-none focus:ring-2 ring-blue-500/20 border border-gray-100"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-3">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="CONTACT@CLIENT.COM"
                            className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold outline-none border border-gray-100"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-3">Location</label>
                        <input
                            required
                            placeholder="CITY, COUNTRY"
                            className="w-full bg-gray-50 p-4 rounded-2xl text-xs font-bold uppercase outline-none border border-gray-100"
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase ml-3">Start Date</label>
                            <input
                                required
                                type="date"
                                min={today}
                                value={formData.contractStart}
                                className="w-full bg-gray-50 p-4 rounded-2xl text-[10px] font-bold outline-none border border-gray-100"
                                onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase ml-3">Expiry Date</label>
                            <input
                                required
                                type="date"
                                min={formData.contractStart}
                                className="w-full bg-gray-100 p-4 rounded-2xl text-[10px] font-bold outline-none border border-red-50 focus:border-red-200"
                                onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 space-y-2">
                        <button type="submit" className="w-full bg-[#0F172A] text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl shadow-blue-900/20">
                            Confirm Client
                        </button>
                        <button type="button" onClick={onClose} className="w-full py-2 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-red-500 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}