"use client";
import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import StatCard from "../components/StatCard";
import {
  RefreshCw, MapPin, Activity, ShieldAlert,
  Loader2, Users, Shield, Clock
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState({ posts: [], guards: [], clients: [] });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchOpsData = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncStatus("idle");

      // Fetching all operational data to calculate the summary
      const [postsRes, guardsRes, clientsRes] = await Promise.all([
        api.get("/posts"),
        api.get("/guards"),
        api.get("/clients")
      ]);

      setData({
        posts: Array.isArray(postsRes) ? postsRes : (postsRes as any).data || [],
        guards: Array.isArray(guardsRes) ? guardsRes : (guardsRes as any).data || [],
        clients: Array.isArray(clientsRes) ? clientsRes : (clientsRes as any).data || [],
      });
      setSyncStatus("success");
    } catch (err) {
      console.error("Critical Sync Failure:", err);
      setSyncStatus("error");
    } finally {
      // Small delay to make the UI transition feel smooth
      setTimeout(() => setIsSyncing(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchOpsData();
  }, [fetchOpsData]);

  // --- Dynamic Calculations ---
  const activeGuards = data.guards.filter((g: any) => g.status === 'ACTIVE').length;
  const unmannedPosts = data.posts.filter((p: any) => !p.guardId).length;
  const totalDeployments = data.posts.length - unmannedPosts;

  return (
    <div className="flex flex-col min-h-screen bg-[#E9EBEF]">
      {/* HEADER SECTION */}
      <header className="h-24 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40 border-b border-black/5">
        <div>
          <h1 className="text-xl font-black text-[#1B2537] uppercase tracking-tighter">Operations Dashboard</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Command Stream</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl flex flex-col items-center shadow-sm transition-colors ${syncStatus === "error" ? "bg-red-600" : "bg-[#F59E0B]"
            } text-white`}>
            <span className="text-[8px] font-black uppercase opacity-70">Network</span>
            <span className="text-[10px] font-black italic flex items-center gap-1 uppercase">
              {isSyncing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
              {syncStatus === "error" ? "Link Failed" : "Sync'd Data"}
            </span>
          </div>
          <button
            onClick={fetchOpsData}
            disabled={isSyncing}
            className="bg-white hover:bg-[#1B2537] hover:text-white text-[#1B2537] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase border border-slate-200 transition-all active:scale-95"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="p-8 flex-1 max-w-[1600px] mx-auto w-full">
        {/* ACTION BAR */}
        <div className="flex gap-4 mb-8">
          <button className="bg-[#1B2537] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg hover:bg-orange-500 transition-colors">
            <Activity size={14} /> New Deployment
          </button>
        </div>

        {/* SUMMARY SECTION - Using the new StatCard component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Guards"
            value={data.guards.length}
            subtitle={`${activeGuards} Active personnel`}
            color="blue"
            icon={Users}
          />
          <StatCard
            title="Active clients"
            value={data.clients.length}
            subtitle="Across Rwanda"
            color="slate"
            icon={MapPin}
          />
          <StatCard
            title="Deployments"
            value={totalDeployments}
            subtitle="Currently Occupied"
            color="orange"
            icon={Shield}
          />
          <StatCard
            title="Unmanned"
            value={unmannedPosts}
            subtitle="Awaiting Assignment"
            color="red"
            icon={Clock}
          />
        </div>

        {/* LIVE SITE MONITOR GRID */}
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          Live Site Monitor
          <div className="h-px flex-1 bg-slate-200" />
        </h2>

        {data.posts.length === 0 && !isSyncing ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#1B2537]/20 uppercase font-black italic">
            <ShieldAlert size={48} className="mb-4" />
            <p>{syncStatus === "error" ? "Intel Connection Lost" : "No Active Posts Found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-[1.5rem] shadow-sm flex flex-col overflow-hidden border border-black/5 hover:shadow-xl transition-all">
                <div className="flex justify-end h-1.5">
                  <div className="w-1/2 bg-[#F59E0B] rounded-bl-lg" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2 text-slate-400">
                    <span className="text-[9px] font-black uppercase">
                      {post.client?.name || "Unassigned Site"}
                    </span>
                    <span className="text-[10px] font-bold opacity-30">#{post.id}</span>
                  </div>
                  <h2 className="text-xl font-black text-[#1B2537] italic uppercase mb-6 tracking-tighter leading-tight">
                    {post.title}
                  </h2>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                    <span className="text-slate-400 font-black text-[8px] uppercase tracking-widest">Personnel</span>
                    <span className={`text-[10px] font-black italic ${post.guardId ? 'text-green-600' : 'text-orange-600'}`}>
                      {post.guardId ? '1 ACTIVE' : 'UNMANNED'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}