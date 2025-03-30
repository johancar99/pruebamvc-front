// src/shared/services/TokenService.ts

export const TokenService = {
    /**
     * Guarda el token y la fecha de expiración en localStorage
     * @param token
     * @param expiresAt
     */
    setToken(token: string, expiresAt: string): void {
      localStorage.setItem('authToken', token);
      localStorage.setItem('tokenExpiresAt', expiresAt);
    },
  
    /**
     * Obtiene el token del localStorage
     * @returns
     */
    getToken(): string | null {
      return localStorage.getItem('authToken');
    },
  
    /**
     * Elimina el token y la fecha de expiración del localStorage
     */
    removeToken(): void {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiresAt');
    },
  
    /**
     * Verifica si el token ha expirado comparando la fecha actual con la fecha almacenada.
     * @returns
     */
    isTokenExpired(): boolean {
      const expiresAt = localStorage.getItem('tokenExpiresAt');
      if (!expiresAt) {
        return true;
      }
      const expirationDate = new Date(expiresAt);
      const now = new Date();
      return now > expirationDate;
    }
  };
  