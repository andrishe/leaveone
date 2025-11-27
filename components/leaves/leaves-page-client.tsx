'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { LeavesList } from '@/components/leaves/leaves-list';
import { LeaveRequestModal } from '@/components/leaves/leave-request-modal';

interface LeavesPageClientProps {
  userId: string;
}

export function LeavesPageClient({ userId }: LeavesPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <>
      {/* New Request Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Nouvelle demande
        </button>
      </div>

      {/* Leaves List */}
      <LeavesList userId={userId} key={refreshKey} />

      {/* Request Modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
