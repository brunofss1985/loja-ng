import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/authService/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  userType!: string| null

  constructor(private route: Router, private authServ: AuthService) { }

  isOpen = false;

  exit() {
    localStorage.clear()
    this.route.navigate(['']);
  }

  ngOnInit(): void {

    const userType = this.authServ.getUserType();
    this.userType = userType
    }
  

}
