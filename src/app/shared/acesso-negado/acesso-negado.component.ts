import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  templateUrl: './acesso-negado.component.html',
  styleUrls: ['./acesso-negado.component.scss']
})
export class AcessoNegadoComponent implements OnInit {

  constructor(private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigate() {
      this.location.back();
    }

}
