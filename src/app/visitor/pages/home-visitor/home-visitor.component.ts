import { Component} from '@angular/core';

export interface Mensagem {
  nome: string;
  idade: number;
  proff: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home-visitor.component.html',
  styleUrls: ['./home-visitor.component.scss']
})
export class HomeComponent {
}