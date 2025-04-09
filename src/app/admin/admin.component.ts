import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isSidebarOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  exit() {
    localStorage.clear()
    this.router.navigate(['']);
  }

}
