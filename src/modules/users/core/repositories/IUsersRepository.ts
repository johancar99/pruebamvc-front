import type { User } from '../entities/User';

export interface UsersCrudFilters {
  search?: string;
  filter?: number | null;
  perPage?: number;
}

export interface IUsersRepository {
  getUsers(filters?: UsersCrudFilters): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  updateUserStatus(id: number, active: number): Promise<void>;
}
