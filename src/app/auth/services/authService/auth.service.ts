import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'auth-token';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUserType(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    try {
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.userType || null;
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
      return null;
    }
  }


}
