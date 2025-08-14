import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/authService/auth.service';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss']
})
export class PublicHomeComponent {
  constructor(private authService: AuthService) {}
  logout() {
    this.authService.clearSession();
  }
}
