import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private router: Router) { }

  isSidebarOpen = false;

  ngOnInit(): void {
  }
  exit() {
    localStorage.clear()
    this.router.navigate(['']);
  }

}
