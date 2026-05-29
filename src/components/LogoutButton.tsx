'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2"
    >
      Sign Out
    </button>
  );
}
