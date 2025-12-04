'use client';

import { useEffect, useState } from 'react';
import Shifts from './Shifts';
import { AddShift } from './AddShift';
import type { Shift } from '@/models/Shift';
import { ShiftsService } from '@/services/shiftService';
import { Notification } from '@/components/ui/notification';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

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

  /* 
  Hakkasin siia tegema funktsiooni, mis kontrollib, kas vahetuses on töötajaid.
  const employeeCheck = (shiftId) => {
    
  } */

  const handleDeleteShift = async (shiftId: string) => {
    setPendingDeleteId(shiftId);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await ShiftsService.delete(pendingDeleteId);
      await fetchShifts();
    } catch (err) {
      console.error('Failed to delete shift', err);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleEditShift = (shift: Shift) => {
    if (!shift) return alert('Shift not found');

    setEditingShift(shift);
    setShowModal(true);
  };

  const handleUpdateShift = async (updatedShift: Partial<Shift>) => {
    if (!editingShift) return;

    try {
      const saved = await ShiftsService.update(editingShift.id, updatedShift);
      setShifts((prev) =>
        prev.map((s) =>
          s.id === editingShift.id
            ? { ...s, ...saved, rules: updatedShift.rules ?? s.rules }
            : s
        )
      );
    } catch (err) {
      console.error('Failed to update shift', err);
    } finally {
      setEditingShift(null);
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  return (
    <>
      <Shifts
        shifts={shifts}
        isLoading={isLoading}
        onAddShift={() => setShowModal(true)}
        onEditShift={handleEditShift}
        onDeleteShift={handleDeleteShift}
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 w-[850px]"
            onClick={(e) => e.stopPropagation()}
          >
            <AddShift
              onSave={editingShift ? handleUpdateShift : handleCreateShift}
              onDiscard={() => {
                setShowModal(false);
                setEditingShift(null);
              }}
              editingShift={editingShift ?? undefined}
            />
          </div>
        </div>
      )}

      {pendingDeleteId && (
        <Notification
          message="Are you sure you want to delete this shift?"
          type="info"
          onConfirm={confirmDelete}
          onClose={cancelDelete}
        />
      )}
    </>
  );
}
