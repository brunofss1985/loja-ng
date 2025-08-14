import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly SESSION_ID_KEY = 'sessionId';
  private readonly API_URL = 'http://localhost:8080/api/auth'; // ajuste conforme seu backend

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).subscribe({
      next: (response) => {
        localStorage.setItem(this.TOKEN_KEY, response.jwtToken);
        localStorage.setItem(this.SESSION_ID_KEY, response.sessionId);
        this.router.navigate(['/private/dashboard']); // ajuste a rota conforme seu app
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Credenciais inválidas');
      }
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    this.router.navigate(['/public/default-login/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token; // simples verificação de presença
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_ID_KEY);
  }
}
