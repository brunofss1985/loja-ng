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

  // Configuração da tabela reutilizável
  columns: string[] = ['nome', 'marca', 'dataValidade'];
  columnLabels: { [key: string]: string } = {
    nome: 'Nome',
    marca: 'Marca',
    dataValidade: 'Validade'
  };

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

  formatarCelula(header: string, value: any): string {
    if (header === 'dataValidade') {
      return new Date(value).toLocaleDateString('pt-BR');
    }

    return value;
  }
}
