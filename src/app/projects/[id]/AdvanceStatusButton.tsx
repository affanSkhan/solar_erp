'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Created',
  DOCUMENTS_GENERATED: 'Docs Generated',
  SUBMITTED: 'Submitted',
  VERIFICATION_PENDING: 'Verification Pending',
  METER_INSTALLATION_PENDING: 'Meter Installation Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
};

const NEXT_STATUS: Record<string, string | null> = {
  CREATED: 'DOCUMENTS_GENERATED',
  DOCUMENTS_GENERATED: 'SUBMITTED',
  SUBMITTED: 'VERIFICATION_PENDING',
  VERIFICATION_PENDING: 'METER_INSTALLATION_PENDING',
  METER_INSTALLATION_PENDING: 'APPROVED',
  APPROVED: 'COMPLETED',
  COMPLETED: null,
};

export function AdvanceStatusButton({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const next = NEXT_STATUS[currentStatus];
  if (!next) return null;

  const handleAdvance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, newStatus: next }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleAdvance}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
      >
        {loading ? 'Updating…' : `Mark as: ${STATUS_LABELS[next]}`}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
