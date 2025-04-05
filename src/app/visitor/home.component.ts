import { Component, EventEmitter, Output } from '@angular/core';

export interface Mensagem {
  nome: string;
  idade: number;
  proff: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}