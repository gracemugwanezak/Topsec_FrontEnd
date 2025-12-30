import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        <div className="flex h-screen w-full bg-[#E9EBEF]">
          {/* SIDEBAR: Using direct hex color to bypass config issues */}
          <aside className="w-72 h-full shrink-0 bg-[#0B1E3D] z-20 shadow-2xl">
            <Sidebar />
          </aside>

          <main className="flex-1 h-full overflow-y-auto relative bg-[#E9EBEF]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}