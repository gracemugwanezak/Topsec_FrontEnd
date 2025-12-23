import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-topsec overflow-hidden">
        <div className="flex h-screen w-full">
          {/* SIDEBAR WRAPPER: Stays TopSec Blue */}
          <div className="w-72 h-full shrink-0 bg-topsec border-r border-white/5 z-20">
            <Sidebar />
          </div>

          {/* MAIN PAGE AREA: TopSec Blue */}
          <main className="flex-1 h-full overflow-y-auto bg-topsec relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}