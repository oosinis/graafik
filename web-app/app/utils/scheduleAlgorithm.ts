export function generateSchedule(employees: any[], shifts: any[], startDate: Date, endDate: Date, opts: any) {
  // VERY small placeholder algorithm used for build-time typing.
  // It creates an assignment for each employee for each day with a random shift.
  const assignments: any[] = [];
  const days: string[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    days.push(key);
    current.setDate(current.getDate() + 1);
  }

  employees.forEach(emp => {
    days.forEach((d, i) => {
      const shift = shifts[i % shifts.length] || shifts[0];
      if (!shift) return;
      assignments.push({
        employeeId: emp.id,
        employeeName: emp.name,
        date: d,
        shiftId: shift.id,
        shiftName: shift.name || shift.type || 'Shift',
        shiftColor: shift.color || '#000',
        shiftBg: shift.bg || '#fff',
        startTime: shift.startTime || '09:00',
        endTime: shift.endTime || '17:00',
      });
    });
  });

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    assignments
  };
}
