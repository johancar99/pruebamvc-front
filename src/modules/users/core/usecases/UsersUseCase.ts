import type { IUsersRepository, UsersCrudFilters } from '../repositories/IUsersRepository';
import type { User } from '../entities/User';

export class UsersCrudUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  // Lista usuarios aplicando filtros
  async getUsers(filters: UsersCrudFilters = {}): Promise<User[]> {
    return this.usersRepository.getUsers(filters);
  }

  // Obtiene un usuario por su ID
  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }

  // Crea un nuevo usuario
  async createUser(userData: Partial<User>): Promise<User> {
    return this.usersRepository.createUser(userData);
  }

  // Actualiza un usuario existente
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return this.usersRepository.updateUser(id, userData);
  }

  // Actualiza el estado de un usuario existente
  async updateUserStatus(id: number, active: number): Promise<void> {
    return this.usersRepository.updateUserStatus(id, active);
  }

  // Elimina un usuario
  async deleteUser(id: number): Promise<void> {
    return this.usersRepository.deleteUser(id);
  }
  
}
