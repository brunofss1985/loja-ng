import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly SESSION_ID_KEY = 'sessionId';
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): void {
    this.http.post<any>(`${this.API_URL}/login`, { email, password }).subscribe({
      next: (response) => {
        this.saveToken(response.jwtToken);
        this.saveSessionId(response.sessionId);
        this.router.navigate(['/private/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Credenciais inválidas');
      }
    });
  }

  logout(): void {
    this.clearSession();
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveSessionId(sessionId: string): void {
    localStorage.setItem(this.SESSION_ID_KEY, sessionId);
  }

  getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_ID_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp && exp > now;
    } catch {
      return false;
    }
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

  getUser(): any | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    try {
      const decodedPayload = JSON.parse(atob(payload));
      return {
        id: decodedPayload.id,
        name: decodedPayload.name,
        email: decodedPayload.email,
        userType: decodedPayload.userType,
        createdAt: decodedPayload.createdAt,
        phone: decodedPayload.phone,
        address: decodedPayload.address,
        points: decodedPayload.points,
        credits: decodedPayload.credits
      };
    } catch (e) {
      console.error('Erro ao extrair dados do usuário:', e);
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    this.router.navigate(['']);
  }
}
