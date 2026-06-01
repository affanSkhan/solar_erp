'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{ 
        textDecoration: 'none', 
        color: '#333', 
        fontSize: '14px', 
        fontWeight: '600',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '6px 12px',
        cursor: 'pointer'
      }}
    >
      Sign Out
    </button>
  );
}
