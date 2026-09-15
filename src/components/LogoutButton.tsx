'use client';

import { useTransition } from 'react';
import { logoutAdminAction } from '@/app/admin/actions';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logoutAdminAction())}
      disabled={isPending}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        background: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '8px',
        color: '#fca5a5',
        fontSize: '0.82rem',
        fontWeight: 500,
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
      }}
      title="End admin session"
    >
      <span>🔒</span>
      <span>{isPending ? 'Ending Session...' : 'Sign Out'}</span>
    </button>
  );
}
