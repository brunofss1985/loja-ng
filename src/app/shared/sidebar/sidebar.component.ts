import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/authService/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  @Output() toggleSidebar = new EventEmitter<boolean>();

  userType!: string | null

  constructor(private route: Router, private authServ: AuthService) { }

  isOpen = false;

  onMouseEnter() {
    this.isOpen = true;
    this.toggleSidebar.emit(true); // dispara pro componente pai
  }

  onMouseLeave() {
    this.isOpen = false;
    this.toggleSidebar.emit(false); // dispara pro componente pai
  }

  exit() {
    localStorage.clear()
    this.route.navigate(['']);
  }

  ngOnInit(): void {

    const userType = this.authServ.getUserType();
    this.userType = userType

  }
}
