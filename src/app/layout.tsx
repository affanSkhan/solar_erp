import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {/* Top Navbar */}
          <header className="bg-blue-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0 font-bold text-xl tracking-wider">
                  SOLAR ERP
                </div>
                {session && (
                  <nav className="flex space-x-4 items-center">
                    <Link href="/" className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link href="/customers" className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium">Customers</Link>
                    <Link href="/projects/new" className="bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium">+ New Project</Link>
                    <div className="w-px h-6 bg-blue-700 mx-2"></div>
                    <Link href="/settings" className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2">Settings</Link>
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
