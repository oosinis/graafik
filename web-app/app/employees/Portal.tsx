import { useState } from 'react';
import type { Employee } from '@/models/Employee';
import type { Shift } from '@/models/Shift';
import type { GeneratedSchedule } from '@/models/Schedule';
import { AvailabilityData } from './AvailabilityDialog';
import { EmployeeLayout } from './layout';
import { EmployeeDashboard } from './Dashboard';
import { EmployeeSchedule } from './Schedule';
import { EmployeeAvailability } from './Availability';

interface EmployeePortalProps {
  userData: any;
  employees: Employee[];
  shifts: Shift[];
  roles: Array<{ name: string; color: string; backgroundColor: string }>;
  generatedSchedules: { [key: string]: GeneratedSchedule };
  onUpdateAvailability: (employeeId: string, availability: AvailabilityData) => void;
  onLogout: () => void;
}

export function EmployeePortal({
  userData,
  employees,
  shifts,
  roles,
  generatedSchedules,
  onUpdateAvailability,
  onLogout
}: EmployeePortalProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Find the employee record that matches the logged-in user's email
  const myEmployee = employees.find(emp => emp.email === userData.email);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleSaveAvailability = (availability: AvailabilityData) => {
    if (myEmployee) {
      onUpdateAvailability(myEmployee.id, availability);
    }
  };

  return (
    <EmployeeLayout
      onLogout={onLogout}
      activeItem={currentPage}
      onNavigate={handleNavigate}
      userName={userData?.name}
      userEmail={userData?.email}
    >
      {currentPage === 'dashboard' && (
        <EmployeeDashboard
          userData={userData}
          employees={employees}
          shifts={shifts}
          generatedSchedules={generatedSchedules}
          myEmployee={myEmployee}
        />
      )}
      {currentPage === 'schedule' && (
        <EmployeeSchedule
          employees={employees}
          roles={roles}
          generatedSchedules={generatedSchedules}
        />
      )}
      {currentPage === 'availability' && myEmployee && (
        <EmployeeAvailability
          key={`availability-${myEmployee.id}-${JSON.stringify(myEmployee.availability)}`}
          employeeId={myEmployee.id}
          availability={myEmployee.availability as AvailabilityData | undefined}
          onSave={handleSaveAvailability}
        />
      )}
      {currentPage === 'availability' && !myEmployee && (
        <div className="p-[48px] flex items-center justify-center">
          <div className="text-center">
            <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796]">
              Your employee profile hasn't been created yet. Please contact your admin.
            </p>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
