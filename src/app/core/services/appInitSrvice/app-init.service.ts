import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(private authService: AuthService) {}

  init(): Promise<void> {
    return new Promise((resolve) => {
      const token = this.authService.getToken();

      if (token) {
        const isValid = this.authService.isAuthenticated();
        console.log('[APP INIT] Token encontrado. Válido:', isValid);
      } else {
        console.log('[APP INIT] Nenhum token encontrado.');
      }

      resolve(); // segue para bootstrap da aplicação
    });
  }
}
