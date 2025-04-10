import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  constructor() { }

  headers = ['ID', 'Nome', 'Email', 'Tipo de Usuário'];
  dados = [
    { ID: 1, 'Nome': 'Mark', 'Email': 'Otto@gmail.com', 'Tipo de Usuário': 'ADMIN' },
    { ID: 2, 'Nome': 'Jacob', 'Email': 'Thornton@gmail.com' , 'Tipo de Usuário': 'USER'},
    { ID: 3, 'Nome': 'Jacob', 'Email': 'Thornton@gmail.com' , 'Tipo de Usuário': 'ADMIN'},
    { ID: 4, 'Nome': 'Jacob', 'Email': 'Thornton@gmail.com' , 'Tipo de Usuário': 'USER'},
  ];


  ngOnInit(): void {
  }

}
