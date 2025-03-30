// src/modules/users/infrastructure/http/UsersApi.ts
import axios from 'axios';
import type { IUsersRepository, UsersCrudFilters } from '../../core/repositories/IUsersRepository';
import type { User } from '../../core/entities/User';
import { TokenService } from '../../../../shared/services/TokenService';

export class UsersApi implements IUsersRepository {
  private apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
  });

  constructor() {
    // Agregar interceptor para incluir el token en todas las peticiones
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

  // Método para obtener usuarios con filtros y/o paginación
  async getUsers(filters: UsersCrudFilters = {}): Promise<User[]> {
    const response = await this.apiClient.get('/users', {
      params: filters,
    });
    return response.data.data.data;
  }

  // Método para obtener un usuario por ID
  async getUserById(id: number): Promise<User> {
    const response = await this.apiClient.get(`/users/${id}`);
    return response.data.data;
  }

  // Método para crear un nuevo usuario
  async createUser(userData: Partial<User>): Promise<User> {
    const response = await this.apiClient.post('/users', userData);
    return response.data.data;
  }

  // Método para actualizar un usuario existente
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.apiClient.put(`/users/${id}`, userData);
    return response.data.data;
  }

   // Método para actualizar el estado de un usuario existente
  async updateUserStatus(id: number, active: number): Promise<void> {
    await this.apiClient.put(`/users/update-status/${id}`, { active });
  }

  // Método para eliminar un usuario
  async deleteUser(id: number): Promise<void> {
    await this.apiClient.delete(`/users/${id}`);
  }
}
