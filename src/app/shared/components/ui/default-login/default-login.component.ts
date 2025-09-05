import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/authService/auth.service';

@Component({
  selector: 'app-default-login',
  templateUrl: './default-login.component.html',
  styleUrls: ['./default-login.component.scss'],
})
export class DefaultLoginComponent implements OnInit {
  showMain!: boolean;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.showMain = this.auth.isAuthenticated();
  }
}