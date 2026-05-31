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
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/60 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                    SOLAR ERP
                  </span>
                </div>
                {session && (
                  <nav className="flex gap-6 items-center">
                    <Link href="/" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200">Dashboard</Link>
                    <Link href="/customers" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200">Customers</Link>
                    <Link href="/projects/new" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200">+ New Project</Link>
                    <div className="w-px h-5 bg-slate-200"></div>
                    <Link href="/settings" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200">Settings</Link>
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
