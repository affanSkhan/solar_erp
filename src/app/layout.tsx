import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solar ERP | Document Automation",
  description: "Enterprise Document Automation for Solar Vendors in India",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${plusJakarta.className} bg-slate-50 text-slate-900 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white selection:bg-emerald-200 selection:text-emerald-900`}>
        <div className="min-h-screen flex flex-col relative z-0">
          {/* Top Navbar - Glassmorphic */}
          <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0 flex items-center gap-3 group cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-black text-xs tracking-widest ml-0.5">ERP</span>
                  </div>
                  <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                    SOLAR
                  </span>
                </div>
                {session && (
                  <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px', marginLeft: 'auto' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', fontWeight: '600' }}>Dashboard</Link>
                    <Link href="/customers" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', fontWeight: '600' }}>Customers</Link>
                    <Link href="/settings" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', fontWeight: '600' }}>Settings</Link>
                    <Link href="/projects/new" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>+ New Project</Link>
                    <LogoutButton />
                  </nav>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Solar ERP Solutions. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
