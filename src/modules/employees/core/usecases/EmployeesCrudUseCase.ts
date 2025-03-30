// src/modules/employees/core/usecases/EmployeesCrudUseCase.ts
import type { IEmployeesRepository, EmployeesCrudFilters } from '../repositories/IEmployeesRepository';
import type { Employee } from '../entities/Employee';

export class EmployeesCrudUseCase {
  constructor(private employeesRepository: IEmployeesRepository) {}

  async getEmployees(filters: EmployeesCrudFilters = {}): Promise<Employee[]> {
    return this.employeesRepository.getEmployees(filters);
  }

  async getEmployeeById(id: number): Promise<Employee> {
    return this.employeesRepository.getEmployeeById(id);
  }

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    return this.employeesRepository.createEmployee(employeeData);
  }

  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee> {
    return this.employeesRepository.updateEmployee(id, employeeData);
  }

  async deleteEmployee(id: number): Promise<void> {
    return this.employeesRepository.deleteEmployee(id);
  }

  async updateEmployeeAccess(id: number, access: boolean): Promise<void> {
    return this.employeesRepository.updateEmployeeAccess(id, access);
  }
}
