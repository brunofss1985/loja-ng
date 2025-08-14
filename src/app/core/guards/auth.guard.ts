import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly TOKEN_KEY = 'jwtToken';

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token) {
      // Aqui você pode validar o token (expiração, etc.)
      return true;
    }

    // Se não estiver autenticado, redireciona para login
    this.router.navigate(['/default-login/login']);
    return false;
  }
}
