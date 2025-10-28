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
  role?: string;
  roleColor?: string;
  roleBg?: string;
  fte?: string;
  email?: string;
  phone?: string;
  assignedShifts?: string[] | AssignedShift[];
  availability?: any;
  userId?: string;
  hasAccount?: boolean;
}
