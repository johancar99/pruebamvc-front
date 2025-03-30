// src/modules/employees/infrastructure/http/EmployeesApi.ts
import axios from 'axios';
import type { IEmployeesRepository, EmployeesCrudFilters } from '../../core/repositories/IEmployeesRepository';
import type { Employee } from '../../core/entities/Employee';
import { TokenService } from '../../../../shared/services/TokenService';

export class EmployeesApi implements IEmployeesRepository {
  private apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Reemplaza con la URL real de tu API
  });

  constructor() {
    // Interceptor para incluir el token en todas las peticiones
    this.apiClient.interceptors.request.use(
      (config) => {
        if (TokenService.isTokenExpired()) {
          TokenService.removeToken();
          return Promise.reject(new Error('Token expired'));
        }
        const token = TokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async getEmployees(filters: EmployeesCrudFilters = {}): Promise<Employee[]> {
    const response = await this.apiClient.get('/employees', {
      params: filters,
    });
    return response.data.data.data;
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await this.apiClient.get(`/employees/${id}`);
    return response.data.data;
  }

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    const response = await this.apiClient.post('/employees', employeeData);
    return response.data.data;
  }

  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<Employee> {
    const response = await this.apiClient.put(`/employees/${id}`, employeeData);
    return response.data.data;
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.apiClient.delete(`/employees/${id}`);
  }

  async updateEmployeeAccess(id: number, access: boolean): Promise<void> {
    await this.apiClient.put(`/employees/update-access/${id}`, { access });
  }

  async importEmployees(data: any[]): Promise<void> {
    console.log(data)
    await this.apiClient.post('/employees/import', { data });
  }

  async entry(document: string): Promise<any> {
    const response = await this.apiClient.post('/entries/', { document });
    return response.data;
  }
}
