// src/modules/users/core/usecases/AuthenticateUserUseCase.ts
import type { IAuthRepository, AuthResponse } from '../repositories/IAuthRepository';

export class AuthenticateUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    return await this.authRepository.login(email, password);
  }
}
