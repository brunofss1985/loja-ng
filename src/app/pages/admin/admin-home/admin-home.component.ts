import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/authService/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  isSidebarOpen = false;
  
 constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
    this.authService.clearToken();
    this.router.navigate(['/public/default-login/login']);
  }
  }

  exit() {
    localStorage.clear()
    this.router.navigate(['']);
  }

}

