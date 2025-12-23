"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Search, UserPlus, ShieldCheck, Loader2, MapPin, ArrowRightLeft, UserMinus } from "lucide-react";
import GuardFormModal from "../components/GuardFormModal.tsx";

export default function GuardsPage() {
    const [guards, setGuards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchGuards = async () => {
        try {
            setLoading(true);
            const res = await api.get("/guards");
            const data = Array.isArray(res) ? res : (res as any).data || [];
            setGuards(data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchGuards(); }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            {/* COMPACT HEADER */}
            <header className="bg-white px-6 py-3 flex items-center justify-between border-b sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Personnel Database</h1>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {guards.length} Records
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Filter by name or ID..."
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#1A2A4A] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-500 transition-all"
                    >
                        <UserPlus size={14} /> New Guard
                    </button>
                </div>
            </header>

            <main className="p-6">
                {/* COMPACT STATS (Smaller Footprint) */}
                <div className="flex gap-4 mb-6">
                    {[{ label: "Total Personnel", val: guards.length, color: "slate" },
                    { label: "Unassigned", val: guards.filter(g => !g.posts?.length).length, color: "amber" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            <span className={`text-lg font-black text-${stat.color}-600`}>{stat.val}</span>
                        </div>
                    ))}
                </div>

                {/* DENSE LIST VIEW (Best for 5000+ records) */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">Officer</th>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">National ID</th>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">Current Deployment</th>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin inline text-amber-500" /></td></tr>
                            ) : guards.map((guard) => (
                                <tr key={guard.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 uppercase italic leading-none">{guard.name}</p>
                                                <p className="text-[9px] text-slate-400 mt-1 font-mono">ID-{guard.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{guard.idNumber || "Not Set"}</td>
                                    <td className="px-4 py-3">
                                        {guard.posts && guard.posts.length > 0 ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <MapPin size={12} />
                                                <span className="text-[10px] font-black uppercase italic">{guard.posts[0].post.title}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                title="Assign/Reassign"
                                                className="p-2 text-slate-400 hover:bg-amber-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <ArrowRightLeft size={14} />
                                            </button>
                                            <button
                                                title="Remove from system"
                                                className="p-2 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <UserMinus size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && <GuardFormModal guard={null} onClose={() => setIsModalOpen(false)} onSuccess={fetchGuards} />}
        </div>
    );
}