import React from 'react';
import type { ScheduleAssignment } from '@/models/Schedule';

interface EditShiftAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: ScheduleAssignment) => void;
  onDelete: () => void;
  assignment: ScheduleAssignment;
  employees: any[];
}

export function EditShiftAssignmentDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  assignment,
  employees
}: EditShiftAssignmentDialogProps) {
  // Stub component - editing functionality disabled for now
  // This component exists to prevent import errors
  // The dialog won't be shown since onScheduleUpdate is not provided
  return null;
}

