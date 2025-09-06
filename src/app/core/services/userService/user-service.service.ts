import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

// 🎯 Nova interface para a criação de senha
export interface PasswordCreation {
  newPassword: string;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  userType?: 'ADMIN' | 'USER';
  password?: string; 
  phone?: string;
  address?: string;
  points?: number;
  credits?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  private currentUserCache: User | null = null;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  getCurrentUser(): Observable<User> {
    if (this.currentUserCache) {
      return of(this.currentUserCache);
    }
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => (this.currentUserCache = user))
    );
  }

  updateCurrentUser(user: User): Observable<User> {
    // 💡 A API irá lidar com a atualização, mas podemos remover o userType
    // e o email do objeto para garantir que não haja alteração indesejada.
    const userToUpdate = { ...user };
    delete userToUpdate.userType;
    delete userToUpdate.email;

    return this.http.put<User>(`${this.apiUrl}/me`, userToUpdate).pipe(
      tap((updatedUser) => {
        this.currentUserCache = updatedUser;
      })
    );
  }

  updatePassword(passwords: PasswordChange): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, passwords);
  }

  // 🎯 Novo método para criar a senha
  setPassword(password: PasswordCreation): Observable<any> {
    return this.http.put(`${this.apiUrl}/set-password`, password);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}