import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../types/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string = "http://localhost:8080/auth/login"

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap((value)=> {
      sessionStorage.setItem("auth-token", value.token)
      sessionStorage.setItem("auth-token", value.name)
    })
  )
  }
}
