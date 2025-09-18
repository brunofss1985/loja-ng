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
  const token = this.authService.getToken();
  const isValid = this.authService.isAuthenticated();

  console.log('%c[GUARD] Token:', 'color: cyan', token);
  console.log('%c[GUARD] isAuthenticated():', 'color: yellow', isValid);

  if (token && !isValid) {
    console.warn('⚠️ Token presente mas inválido. Disparando alerta de sessão expirada.');
    this.authService.handleSessionExpired(state.url);
  } else {
    console.log('✅ Sessão válida OU usuário deslogado — navegação permitida.');
  }

  return of(true);
}

}
