import type { Employee } from '../entities/Employee';

export interface EmployeesCrudFilters {
  search?: string;
  filter?: number | null;
  perPage?: number;
  start_date?: string; // formato "YYYY-MM-DD"
  end_date?: string;   // formato "YYYY-MM-DD"
}

export interface IEmployeesRepository {
  getEmployees(filters?: EmployeesCrudFilters): Promise<Employee[]>;
  getEmployeeById(id: number): Promise<Employee>;
  createEmployee(employeeData: Partial<Employee>): Promise<Employee>;
  updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<void>;
  updateEmployeeAccess(id: number, access: boolean): Promise<void>;
}
