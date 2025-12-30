"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AddPostModal from "../components/AddPostModal";
import AddClientModal from "../components/AddClientModal";
import { api } from "@/lib/api";
import { Building2, Plus, Trash2, MapPin, Calendar, Shield, Layout } from "lucide-react";

interface Client {
    id: number;
    name: string;
    location: string;
    contractStart: string;
    contractEnd: string;
    postCount: number;
    guardCount: number;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [activeClientForPost, setActiveClientForPost] = useState<Client | null>(null);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.get<Client[]>("/clients");
            setClients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleDelete = async (id: number) => {
        if (!confirm("Permanently remove client? This will affect linked posts.")) return;
        try {
            await api.delete(`/clients/${id}`);
            loadData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex flex-col min-h-full">
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                <div>
                    <h1 className="text-xl font-black text-[#0B1E3D] uppercase italic tracking-tighter leading-none">
                        Client <span className="text-red-600">Accounts</span>
                    </h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Management</p>
                </div>
                <button
                    onClick={() => setIsAddClientModalOpen(true)}
                    className="bg-[#0B1E3D] hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                >
                    <Plus size={14} strokeWidth={3} />
                    Add New Client
                </button>
            </header>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Secure Data...</p>
                    </div>
                ) : (
                    clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[210px] group transition-all duration-300 hover:shadow-xl hover:border-red-500/50 relative">
                            <div className="h-1 w-full bg-[#0B1E3D] group-hover:bg-red-600 transition-colors rounded-t-2xl" />

                            <div className="p-4 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] font-black text-slate-300 uppercase">Ref: {String(client.id).padStart(3, '0')}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </div>

                                <div className="mb-3">
                                    <h2 className="text-base font-black text-[#0B1E3D] uppercase italic leading-tight truncate">{client.name}</h2>
                                    <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                                        <MapPin size={10} />
                                        <span className="text-[9px] font-bold uppercase truncate">{client.location}</span>
                                    </div>
                                </div>

                                {/* Linkable Stats Box */}
                                <div className="flex gap-2 mb-4">
                                    <Link
                                        href={`/posts?clientId=${client.id}`}
                                        className="flex-1 bg-slate-50 border border-slate-100 p-2 rounded-lg text-center hover:bg-blue-50 hover:border-blue-200 transition-all group/stat"
                                    >
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <Layout size={8} className="text-slate-400 group-hover/stat:text-blue-500" />
                                            <p className="text-[7px] font-black text-slate-400 uppercase group-hover/stat:text-blue-500">Posts</p>
                                        </div>
                                        <p className="text-sm font-black text-[#0B1E3D] group-hover/stat:text-blue-700">{client.postCount || 0}</p>
                                    </Link>

                                    <Link
                                        href={`/guards?clientName=${encodeURIComponent(client.name)}`}
                                        className="flex-1 bg-slate-50 border border-slate-100 p-2 rounded-lg text-center hover:bg-emerald-50 hover:border-emerald-200 transition-all group/stat"
                                    >
                                        <div className="flex items-center justify-center gap-1 mb-0.5">
                                            <Shield size={8} className="text-slate-400 group-hover/stat:text-emerald-500" />
                                            <p className="text-[7px] font-black text-slate-400 uppercase group-hover/stat:text-emerald-500">Guards</p>
                                        </div>
                                        <p className="text-sm font-black text-[#0B1E3D] group-hover/stat:text-emerald-700">{client.guardCount || 0}</p>
                                    </Link>
                                </div>

                                <div className="mt-auto flex gap-2">
                                    <button
                                        onClick={() => setActiveClientForPost(client)}
                                        className="flex-1 bg-slate-100 hover:bg-[#0B1E3D] hover:text-white text-[#0B1E3D] py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                                    >
                                        Deploy Post
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isAddClientModalOpen && (
                <AddClientModal onClose={() => setIsAddClientModalOpen(false)} onSuccess={loadData} />
            )}
            {activeClientForPost && (
                <AddPostModal
                    clientId={activeClientForPost.id}
                    clientName={activeClientForPost.name}
                    onClose={() => setActiveClientForPost(null)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
}