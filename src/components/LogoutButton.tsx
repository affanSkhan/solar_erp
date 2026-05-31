'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
    >
      Sign Out
    </button>
  );
}
