
import { Component } from '@angular/core';
import { EstoqueService, MovimentacaoEstoque } from 'src/app/core/services/estoqueService/estoque.service';

@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss']
})
export class MovimentacoesComponent {
  lote: string = '';
  movimentacoes: MovimentacaoEstoque[] = [];
  carregando = false;
  erro: string | null = null;

  constructor(private estoqueService: EstoqueService) {}

  buscarMovimentacoes(): void {
    this.carregando = true;
    this.erro = null;
    this.estoqueService.buscarPorLote(this.lote).subscribe({
      next: (data) => {
        this.movimentacoes = data;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao buscar movimentações.';
        this.carregando = false;
      }
    });
  }
}
