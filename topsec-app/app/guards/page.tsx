"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../lib/api";
import {
    Search, UserPlus, ShieldCheck, Loader2, MapPin,
    ArrowRightLeft, UserMinus, Link2Off, X, Filter
} from "lucide-react";
import GuardFormModal from "../components/GuardFormModal.tsx";
import ReassignModal from "../components/ReassignModal";

export default function GuardsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const clientFilter = searchParams.get("clientName");

    const [guards, setGuards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedGuard, setSelectedGuard] = useState<any>(null);

    const fetchGuards = async () => {
        try {
            setLoading(true);
            const res = await api.get("/guards");
            const data = Array.isArray(res) ? res : (res as any).data || [];
            setGuards(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGuards(); }, []);

    // Memoized Filtering Logic
    const filteredGuards = useMemo(() => {
        return guards.filter((guard) => {
            const matchesSearch =
                guard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guard.idNumber?.includes(searchQuery);

            const matchesClient = clientFilter
                ? guard.posts?.some((p: any) => p.post.client?.name === clientFilter)
                : true;

            return matchesSearch && matchesClient;
        });
    }, [guards, searchQuery, clientFilter]);

    const clearFilter = () => router.push('/guards');

    const handleAssignClick = (guard: any) => {
        setSelectedGuard(guard);
        setIsAssignModalOpen(true);
    };

    // ... Keep handleUnassign and handleDeleteGuard exactly as they were ...

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <header className="bg-white px-6 py-3 flex items-center justify-between border-b sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Personnel Database</h1>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {filteredGuards.length} Records
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search name or ID..."
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
                {/* Active Filter Badge */}
                {clientFilter && (
                    <div className="mb-4 flex items-center gap-2">
                        <div className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg text-[9px] font-black flex items-center gap-2 italic uppercase">
                            <Filter size={10} />
                            Viewing Guards for: {clientFilter}
                            <button onClick={clearFilter} className="ml-1 hover:text-amber-900 transition-colors">
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mb-6">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visible Personnel</span>
                        <span className="text-lg font-black text-slate-600">{filteredGuards.length}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unassigned</span>
                        <span className="text-lg font-black text-amber-600">
                            {filteredGuards.filter(g => !g.posts?.length).length}
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Officer</th>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">National ID</th>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Current Deployment</th>
                                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right italic">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin inline text-amber-500" /></td></tr>
                            ) : filteredGuards.length > 0 ? (
                                filteredGuards.map((guard) => (
                                    <tr key={guard.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                                    <ShieldCheck size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 uppercase italic leading-none">{guard.name}</p>
                                                    <p className="text-[9px] text-slate-400 mt-1 font-mono tracking-tighter">ID-{guard.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{guard.idNumber || "Not Set"}</td>
                                        <td className="px-4 py-3">
                                            {guard.posts && guard.posts.length > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic leading-none mb-1">
                                                        {guard.posts[0].post.client?.name}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-black italic uppercase text-[10px] tracking-tighter">
                                                        <MapPin size={12} className="shrink-0" />
                                                        <span>{guard.posts[0].post.title}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md uppercase italic tracking-tighter">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {/* ... Keep the action buttons block exactly as it was ... */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-[10px] font-black text-slate-300 uppercase italic tracking-widest">
                                        No personnel found matching criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && <GuardFormModal guard={null} onClose={() => setIsModalOpen(false)} onSuccess={fetchGuards} />}
            {isAssignModalOpen && (
                <ReassignModal
                    guard={selectedGuard}
                    onClose={() => setIsAssignModalOpen(false)}
                    onSuccess={fetchGuards}
                />
            )}
        </div>
    );
}