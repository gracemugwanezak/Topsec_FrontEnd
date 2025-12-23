"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Search, UserPlus, ShieldCheck, Loader2 } from "lucide-react";

export default function GuardsPage() {
    const [guards, setGuards] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuards = async () => {
            try {
                const res = await api.get("/guards");
                let data: unknown[] = [];
                if (Array.isArray(res)) data = res;
                else if (res && typeof res === 'object') {
                    const container = (res as unknown) as Record<string, unknown>;
                    if (Array.isArray(container.data)) data = container.data;
                }
                setGuards(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchGuards();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#0B1E3D]">
            {/* HEADER */}
            <header className="h-24 bg-[#F9F8F3] px-8 flex items-center justify-between sticky top-0 z-40 border-b border-black/5 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-[#0B1E3D] uppercase italic tracking-tighter leading-none">
                        Personnel <span className="text-red-600">Roster</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Security Force</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 pr-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-red-600 w-64 shadow-inner"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-[#0B1E3D] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                        <UserPlus size={14} />
                        Register Guard
                    </button>
                </div>
            </header>

            {/* GUARDS GRID */}
            <main className="p-8 flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-64 text-white/20">
                        <Loader2 className="animate-spin" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {guards.map((untypedGuard) => {
                            const guard = (untypedGuard as unknown) as Record<string, any>;
                            return (
                                <div key={guard.id} className="bg-[#F9F8F3] rounded-[2rem] p-6 shadow-2xl flex flex-col group transition-all duration-500 hover:translate-y-[-4px]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#0B1E3D] flex items-center justify-center text-white shadow-lg">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300">ID: {String(guard.id).slice(-4)}</span>
                                    </div>

                                    <h2 className="text-xl font-black text-[#0B1E3D] italic uppercase leading-none tracking-tighter mb-1">
                                        {guard.first_name} {guard.last_name}
                                    </h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                        National ID: {guard.national_id || "N/A"}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-black/5">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[8px] font-black text-slate-400 uppercase">Current Status</span>
                                            <span className="text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded-md">
                                                Available
                                            </span>
                                        </div>

                                        {/* CHANGED "STATION INTEL" TO "VIEW PROFILE" */}
                                        <button className="w-full py-3 bg-red-600 hover:bg-[#0B1E3D] text-white rounded-xl shadow-md text-[10px] font-black uppercase tracking-widest transition-all">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}