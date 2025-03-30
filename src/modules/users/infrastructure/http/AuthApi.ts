import axios from 'axios';
import type { IAuthRepository, AuthResponse } from '../../core/repositories/IAuthRepository';
import type { User } from '../../core/entities/User';

export class AuthApi implements IAuthRepository {
  private apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
  });

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.apiClient.post('/login', { email, password });
    const authData = response.data.data;
    const user: User = authData.user;
    const token: string = authData.token;
    return { token, user };
  }
}