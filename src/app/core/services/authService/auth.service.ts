import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly SESSION_ID_KEY = 'sessionId';
  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): void {
    this.http.post<any>(`${this.API_URL}/login`, { email, password }).subscribe({
      next: (response) => {
        this.saveToken(response.token);
        this.saveSessionId(response.sessionId.toString());
        
        // 🔄 Dispara evento para sincronizar carrinho
        window.dispatchEvent(new CustomEvent('auth:login'));
        
        this.router.navigate(['/private/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Credenciais inválidas');
      }
    });
  }

  register(name: string, email: string, password: string, userType: string): void {
    this.http.post<any>(`${this.API_URL}/register`, { 
      name, email, password, userType 
    }).subscribe({
      next: (response) => {
        this.saveToken(response.token);
        this.saveSessionId(response.sessionId.toString());
        
        // 🔄 Dispara evento para sincronizar carrinho
        window.dispatchEvent(new CustomEvent('auth:login'));
        
        this.router.navigate(['/private/dashboard']);
      },
      error: (err) => {
        console.error('Register failed:', err);
        alert('Erro ao criar conta');
      }
    });
  }

  logout(): void {
    const token = this.getToken();
    
    if (token) {
      // 🔄 Dispara evento para limpar carrinho
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      // Chama endpoint de logout
      this.http.post(`${this.API_URL}/logout`, {}).subscribe({
        complete: () => this.clearSession()
      });
    } else {
      this.clearSession();
    }
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

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp && exp > now;
    } catch {
      return false;
    }
  }

  getUserType(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userType || null;
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
      return null;
    }
  }

  getUser(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub, // Email como ID único
        name: payload.name,
        email: payload.sub,
        userType: payload.userType,
        exp: payload.exp
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