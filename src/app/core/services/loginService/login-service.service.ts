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
        this.authService.saveToken(response.token);
      })
    );
  }

  register(name: string, email: string, password: string, userType: 'USER' | 'ADMIN'): Observable<any> {
    return this.http.post(this.registerUrl, { name, email, password, userType });
  }
}
