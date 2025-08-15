import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../authService/auth.service';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../../types/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = `${environment.apiUrl}/auth/login`;
  private registerUrl = `${environment.apiUrl}/auth/register`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        console.log('🔑 Login response:', response);
        
        // Salva token e sessionId
        this.authService.saveToken(response.token);
        this.authService.saveSessionId(response.sessionId);
        
        // 🚀 DISPARA EVENTO PARA SINCRONIZAR CARRINHO
        console.log('🔄 Disparando evento auth:login para sessionId:', response.sessionId);
        window.dispatchEvent(new CustomEvent('auth:login'));
      })
    );
  }

  register(name: string, email: string, password: string, userType: 'USER' | 'ADMIN'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.registerUrl, { name, email, password, userType }).pipe(
      tap(response => {
        console.log('📝 Register response:', response);
        
        // Salva token e sessionId
        this.authService.saveToken(response.token);
        this.authService.saveSessionId(response.sessionId);
        
        // 🚀 DISPARA EVENTO PARA SINCRONIZAR CARRINHO
        console.log('🔄 Disparando evento auth:login para novo usuário:', response.sessionId);
        window.dispatchEvent(new CustomEvent('auth:login'));
      })
    );
  }
}