import type { User } from '../entities/User';

export interface AuthResponse {
  token: string;
  user: User;
  expires_at: string; 
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
}
