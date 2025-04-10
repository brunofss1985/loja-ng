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
  { ID: 1, Nome: 'Mark', Email: 'Otto' },
  { ID: 2, Nome: 'Jacob', Email: 'Thornton', endereço: 'rua iperó' },
  { ID: 2, Nome: 'Jacob', Email: 'Thornton' },
  { ID: 2, Nome: 'Jacob', Último: 'Thornton' },
]

  ngOnInit(): void {
  }

}
