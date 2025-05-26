import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userType = this.authService.getUserType();

    if (userType === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/acesso-negado']);
      return false;
    }
  }

    canActivateChild(): boolean {
    return this.checkAccess();
  }
   private checkAccess(): boolean {
    const userType = this.authService.getUserType();

    if (userType === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/acesso-negado']);
      return false;
    }
  }
}
