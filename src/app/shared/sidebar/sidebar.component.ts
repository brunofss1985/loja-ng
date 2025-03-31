import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  url: string;
  name: string;
  icon: string;
  action?: () => void;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  constructor(private route: Router) {}

    isOpen = false;


  exit(){
    localStorage.clear()
    this.route.navigate(['']);
  }
  
  ngOnInit(): void {
  }

}
