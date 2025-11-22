export interface AssignedShift {
  id: string;
  type?: string;
  start?: string;
  end?: string;
  length?: number;
  roles?: string[];
}

export interface Employee {
  id: string;
  name: string;
  employeeRole?: string;
  roleColor?: string;
  roleBg?: string;
  workLoad?: number;
  email?: string;
  phone?: string;
  assignedShifts?: string[] | AssignedShift[];
  availability?: any;
  userId?: string;
  notes?: string;
  secondaryRole?: string;
  preferredShifts?: string[];
  preferredWorkdays?: string[];
  hasAccount?: boolean;
}
