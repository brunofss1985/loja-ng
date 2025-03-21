import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // Registro de usuário
  register(userType: string, name: string, password: string, email: string): Observable<any> {
  const registerData = { userType, name, password, email }; // Certifique-se de que esses campos estão corretos
  return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  // Login de usuário
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password }; // Corrigido para enviar o email e senha
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  // Salvar o token no localStorage após login
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Obter o token salvo no localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Verificar se o usuário está autenticado (se tem o token)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método para adicionar o token ao cabeçalho nas requisições protegidas
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Exemplo de método que pode ser usado para acessar uma rota protegida
  getUserData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get('http://localhost:8080/user', { headers });
  }
}
