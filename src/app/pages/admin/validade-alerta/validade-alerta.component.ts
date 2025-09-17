
import { Component, OnInit } from '@angular/core';
import { EstoqueService } from 'src/app/core/services/estoqueService/estoque.service';

@Component({
  selector: 'app-validade-alerta',
  templateUrl: './validade-alerta.component.html',
  styleUrls: ['./validade-alerta.component.scss']
})
export class ValidadeAlertaComponent implements OnInit {
  produtos: any[] = [];
  dias: number = 30;
  carregando = false;
  erro: string | null = null;

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = null;
    this.estoqueService.listarProdutosComValidadeProxima(this.dias).subscribe({
      next: (data) => {
        this.produtos = data;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar os produtos.';
        this.carregando = false;
      }
    });
  }
}
