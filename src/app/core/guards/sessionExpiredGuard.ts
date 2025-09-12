import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/authService/auth.service';

@Injectable({ providedIn: 'root' })
export class SessionExpiredGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const hasToken = !!this.authService.getToken(); // 👈 verifica se tem token
    const isValid = this.authService.isAuthenticated();

    if (hasToken && !isValid) {
      console.log('⚠️ Token presente mas expirado. Disparando alerta...');
      this.authService.handleSessionExpired(state.url);
    } else {
      console.log('✅ Sessão válida OU usuário deslogado — sem alerta');
    }

    return of(true);
  }
}
