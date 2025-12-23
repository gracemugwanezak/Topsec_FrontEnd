"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

// 1. Define a strict interface for the logs
interface AuditLog {
    id: number;
    action: string;
    description: string;
    ipAddress?: string;
    createdAt: string; // or Date
}

export default function AuditPage() {
    // REMOVED: useAuth and role checks
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Fetch directly from the unprotected backend endpoint
                const data = await api.get<AuditLog[]>("/audit");
                setLogs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Audit Stream Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="flex h-screen bg-[#F8F9FA]">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b px-8 flex items-center justify-between shadow-sm">
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tight text-[#1A2A4A]">System Audit</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live Security Event Stream</p>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center gap-2 text-blue-600 font-black italic animate-pulse">
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            INTERCEPTING DATA STREAM...
                        </div>
                    ) : (
                        <div className="bg-[#050A14] rounded-2xl p-6 font-mono shadow-2xl border border-blue-900/20">
                            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Log Terminal v1.0</span>
                                <span className="text-[10px] text-green-500 font-bold">● SYSTEM_OPEN_ACCESS</span>
                            </div>

                            <div className="space-y-3">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <div key={log.id} className="text-[12px] group">
                                            <span className="text-gray-600">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                                            <span className="text-blue-500 mx-2 font-black uppercase">{log.action}</span>
                                            <span className="text-gray-300">{log.description}</span>
                                            {log.ipAddress && (
                                                <span className="ml-2 text-gray-700 italic">src: {log.ipAddress}</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-600 italic">No activity recorded in the current buffer.</div>
                                )}
                                <div className="animate-pulse text-green-500 font-black">_</div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}