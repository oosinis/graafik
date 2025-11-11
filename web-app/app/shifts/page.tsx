'use client';

import { useEffect, useState } from 'react';
import Shifts from './Shifts';
import { AddShift } from './AddShift';
import type { Shift } from '@/models/Shift';
import { ShiftsService } from '@/services/shiftService';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      const data = await ShiftsService.getAll();
      setShifts(data);
    } catch (err) {
      console.error('Failed to fetch shifts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleCreateShift = async (shiftData: Partial<Shift>) => {
    try {
      console.log('Sending shift:', shiftData);
      const created = await ShiftsService.create(shiftData);
      if (created) {
        setShifts((prev) => [created, ...prev]);
      } else {
        await fetchShifts();
      }
    } catch (err) {
      console.error('Failed to create shift', err);
    } finally {
      setShowModal(false);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      await ShiftsService.delete(shiftId);
      await fetchShifts();
    } catch (err) {
      console.error('Failed to delete shift', err);
    }
  };

  return (
    <>
      <Shifts
        shifts={shifts}
        isLoading={isLoading}
        onAddShift={() => setShowModal(true)}
        onEditShift={(shift) => console.log('Edit shift:', shift)}
        onDeleteShift={handleDeleteShift}
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 w-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            <AddShift
              onSave={handleCreateShift}
              onDiscard={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
