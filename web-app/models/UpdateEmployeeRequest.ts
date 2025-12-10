
export interface UpdateEmployeeRequest {
    name: string;
    email: string;
    phone: string;
    employeeRole: string;
    secondaryRole: string;
    workLoad: number;
    notes: string;
    preferredShifts: string[];
    preferredWorkdays: string[];
    assignedShifts: string[];
}
