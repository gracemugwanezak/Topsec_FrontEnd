"use client";
import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { RefreshCw, MapPin, Activity, ShieldAlert, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [posts, setPosts] = useState<unknown[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchOpsData = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncStatus("idle");
      const res = await api.get("/posts");
      let validatedData: unknown[] = [];

      if (Array.isArray(res)) {
        validatedData = res;
      } else if (res && typeof res === 'object') {
        const container = (res as unknown) as Record<string, unknown>;
        if (Array.isArray(container.data)) validatedData = container.data;
        else if (Array.isArray(container.posts)) validatedData = container.posts;
      }

      setPosts(validatedData);
      setSyncStatus("success");
    } catch (err) {
      console.error("Critical Sync Failure:", err);
      setSyncStatus("error");
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  }, []);

  useEffect(() => { fetchOpsData(); }, [fetchOpsData]);

  return (
    <div className="flex flex-col min-h-screen bg-[#E9EBEF]">
      <header className="h-24 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40 border-b border-black/5">
        <div>
          <h1 className="text-xl font-black text-[#1B2537] uppercase tracking-tighter">Operations Dashboard</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Command Stream</p>
        </div>

        <div className="flex items-center gap-3">
          {/* SYNC STATUS NOW YELLOW */}
          <div className={`px-4 py-2 rounded-xl flex flex-col items-center shadow-sm transition-colors ${syncStatus === "error" ? "bg-orange-600" : "bg-[#F59E0B]"
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

      <main className="p-8 flex-1">
        {posts.length === 0 && !isSyncing ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#1B2537]/20 uppercase font-black italic">
            <ShieldAlert size={48} className="mb-4" />
            <p>{syncStatus === "error" ? "Intel Connection Lost" : "No Active Posts Found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((untyped) => {
              const post = (untyped as unknown) as Record<string, any>;
              const guards = Array.isArray(post.guards) ? post.guards : [];

              return (
                <div key={post.id || Math.random()} className="bg-[#F9F8F3] rounded-[1.5rem] shadow-xl flex flex-col overflow-hidden border border-white">
                  {/* YELLOW ACCENT BAR */}
                  <div className="flex justify-end h-1.5">
                    <div className="w-1/2 bg-[#F59E0B] rounded-bl-lg" />
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1.5 text-blue-900/40">
                        <MapPin size={12} />
                        <span className="text-[9px] font-black uppercase truncate max-w-[120px]">
                          {post.client?.name || "Unassigned Site"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">#{post.id}</span>
                    </div>

                    <h2 className="text-2xl font-black text-[#1B2537] italic uppercase leading-[0.9] tracking-tighter mb-8">
                      {post.title || "Unknown Post"}
                    </h2>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-3 border-b border-black/5 pb-2">
                        <span className="text-slate-400 font-black text-[8px] uppercase">Personnel</span>
                        <span className={`text-[10px] font-black uppercase ${guards.length === 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {guards.length === 0 ? 'UNMANNED' : `${guards.length} ACTIVE`}
                        </span>
                      </div>
                      {/* YELLOW STATION INTEL BUTTON */}
                      <button className="w-full py-4 bg-[#F59E0B] hover:bg-[#1B2537] text-white rounded-2xl shadow-md text-[11px] font-black uppercase tracking-widest transition-all">
                        Station Intel
                      </button>
                    </div>
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