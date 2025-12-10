import { Role } from "./Role";

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
  role?: Role;
  roleColor?: string;
  roleBg?: string;
  workLoad?: number;
  email?: string;
  phone?: string;
  assignedShifts?: string[] | AssignedShift[];
  availability?: any;
  userId?: string;
  notes?: string;
  secondaryRole?: Role;
  preferredShifts?: string[];
  preferredWorkdays?: string[];
  hasAccount?: boolean;
}


