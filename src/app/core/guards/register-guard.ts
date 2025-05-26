import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userType = this.authService.getUserType();

    if (userType === 'ADMIN' || userType === null) {
      return true;
    } else {
      this.router.navigate(['/acesso-negado']);
      return false;
    }
  }
}
