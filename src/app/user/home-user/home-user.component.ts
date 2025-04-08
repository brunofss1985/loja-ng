import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/authService/auth.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.scss']
})
export class HomeUserComponent implements OnInit {

 
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    }
  

  exit(){
    localStorage.clear()
    this.router.navigate(['']);
  }

}
