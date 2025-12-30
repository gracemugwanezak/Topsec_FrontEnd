"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { api } from "../../lib/api";
import { LayoutDashboard, Shield, Users, MapPin, ClipboardList } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const [stats, setStats] = useState({ guards: 0, clients: 0, posts: 0 });

    useEffect(() => {
        let isMounted = true;
        const fetchStats = async () => {
            try {
                const [g, c, p] = await Promise.all([api.get("/guards"), api.get("/clients"), api.get("/posts")]);
                if (!isMounted) return;
                const getLen = (val: unknown): number => {
                    if (Array.isArray(val)) return val.length;
                    if (val && typeof val === 'object') {
                        const container = (val as unknown) as Record<string, unknown>;
                        if ('data' in container && Array.isArray(container.data)) return container.data.length;
                    }
                    return 0;
                };
                setStats({ guards: getLen(g), clients: getLen(c), posts: getLen(p) });
            } catch (e) { console.error(e); }
        };
        fetchStats();
        return () => { isMounted = false; };
    }, [pathname]);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Guards", path: "/guards", icon: <Shield size={18} />, count: stats.guards },
        { name: "Clients", path: "/clients", icon: <Users size={18} />, count: stats.clients },
        { name: "Posts", path: "/posts", icon: <MapPin size={18} />, count: stats.posts },
        { name: "Audit Logs", path: "/audit", icon: <ClipboardList size={18} /> },
    ];

    return (
        <aside className="flex flex-col h-full w-full bg-[#0B1E3D]">
            {/* UPDATED LOGO SECTION: Matched padding to nav items (px-4) */}
            <div className="px-4 pt-6 pb-4 shrink-0">
                <div className="bg-white px-5 py-4 rounded-xl shadow-xl flex items-center justify-center overflow-hidden min-h-[80px]">
                    <Image
                        src="/Topsec_logo.jpeg"
                        alt="Topsec Logo"
                        width={160}
                        height={50}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                                ? "bg-[#F59E0B] text-white shadow-lg translate-x-1"
                                : "text-white/40 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={isActive ? "text-white" : "text-slate-500"}>{item.icon}</span>
                                {item.name}
                            </div>
                            {item.count !== undefined && (
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black min-w-[20px] text-center ${isActive ? "bg-black/20 text-white" : "bg-blue-600/20 text-blue-400"
                                    }`}>
                                    {item.count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 bg-black/20 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">System Online</span>
                </div>
            </div>
        </aside>
    );
}