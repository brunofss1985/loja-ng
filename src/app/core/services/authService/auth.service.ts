import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly SESSION_ID_KEY = 'sessionId';
  private readonly RETURN_URL_KEY = 'returnUrl';
  private readonly API_URL = `${environment.apiUrl}/auth`;

private sessionExpiredSubject = new ReplaySubject<boolean>(1);
  public sessionExpired$ = this.sessionExpiredSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveSessionId(response.sessionId.toString());
      }),
      catchError(error => {
        console.error('❌ Login failed:', error);
        return of(null);
      })
    );
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/google-login`, { token: idToken }).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveSessionId(response.sessionId.toString());
      }),
      catchError(err => {
        console.error('❌ Google login failed on backend:', err);
        return of(null);
      })
    );
  }

  register(name: string, email: string, password: string, userType: string): void {
    this.http.post<any>(`${this.API_URL}/register`, {
      name,
      email,
      password,
      userType,
    }).subscribe({
      next: (response) => {
        this.saveToken(response.token);
        this.saveSessionId(response.sessionId.toString());
        this.router.navigate(['/private/dashboard']);
      },
      error: (err: any) => {
        console.error('❌ Register failed:', err);
        alert('Erro ao criar conta');
      },
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
  if (!token) {
    console.log('[AuthService] ❌ Nenhum token encontrado.');
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    console.log('[AuthService] Token exp:', exp, '| now:', now);

    return exp && exp > now - 30;
  } catch (e) {
    console.warn('[AuthService] ❌ Erro ao decodificar token:', e);
    return false;
  }
}


  getUser(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.sub,
        userType: payload.userType,
        exp: payload.exp,
        iat: payload.iat // opcional para debug
      };
    } catch (e) {
      console.error('⚠️ Erro ao extrair dados do usuário:', e);
      return null;
    }
  }

  clearSession(redirect: boolean = true): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    if (redirect) {
      this.router.navigate(['/']);
    }
  }

  // 🔁 Sessão Expirada
  handleSessionExpired(currentUrl?: string): void {
    if (currentUrl) this.setReturnUrl(currentUrl);
    this.sessionExpiredSubject.next(true);
    this.clearSession(false);
  }

  setReturnUrl(url: string): void {
    localStorage.setItem(this.RETURN_URL_KEY, url);
  }

  getReturnUrl(): string {
    return localStorage.getItem(this.RETURN_URL_KEY) || '/';
  }

  clearReturnUrl(): void {
    localStorage.removeItem(this.RETURN_URL_KEY);
  }

  getUserType(): string | null {
    const user = this.getUser();
    return user?.userType || null;
  }

  resetSessionExpired(): void {
    this.sessionExpiredSubject.next(false);
  }
}
