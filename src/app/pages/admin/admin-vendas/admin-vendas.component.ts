import { Component, OnInit } from '@angular/core';
import { VendasService, ProdutoVendidoDTO } from 'src/app/core/services/vendasService/vendas.service';
import { TableFilterConfig } from 'src/app/shared/components/layout/tables/tables.component';

@Component({
  selector: 'app-admin-vendas',
  templateUrl: './admin-vendas.component.html',
  styleUrls: ['./admin-vendas.component.scss']
})
export class AdminVendasComponent implements OnInit {
  // Dados para a tabela genérica
  rows: ProdutoVendidoDTO[] = [];
  errorMessage = '';
  selecionada: ProdutoVendidoDTO | null = null;

  // Configuração da tabela genérica
  columns: string[] = [
    'id',
    'orderId',
    'produtoNome',
    'codigoBarras',
    'loteCodigo',
    'customerNome',
    'customerEmail',
    'dataVenda',
    'valorVenda',
  ];

  columnLabels: Record<string, string> = {
    id: 'ID',
    orderId: 'Pedido',
    produtoNome: 'Produto',
    codigoBarras: 'Código de Barras',
    loteCodigo: 'Lote',
    customerNome: 'Cliente',
    customerEmail: 'E-mail',
    dataVenda: 'Data',
    valorVenda: 'Valor',
  };

  sortableColumns: string[] = [
    'id',
    'orderId',
    'produtoNome',
    'codigoBarras',
    'loteCodigo',
    'customerNome',
    'customerEmail',
    'dataVenda',
    'valorVenda',
  ];

  filtersConfig: TableFilterConfig[] = [
    { key: 'orderId', type: 'text', placeholder: 'Pedido' },
    { key: 'produtoNome', type: 'text', placeholder: 'Produto' },
    { key: 'codigoBarras', type: 'text', placeholder: 'Código de Barras' },
    { key: 'loteCodigo', type: 'text', placeholder: 'Lote' },
    { key: 'customerNome', type: 'text', placeholder: 'Cliente' },
    { key: 'customerEmail', type: 'text', placeholder: 'E-mail' },
  ];

  constructor(private vendasService: VendasService) {}

  ngOnInit(): void {
    this.vendasService.listar().subscribe({
      next: v => this.rows = v,
      error: err => this.errorMessage = 'Erro ao carregar vendas: ' + (err?.message || err)
    });
  }

  // Formatação de células (data e moeda)
  cellFormatter = (header: string, value: any) => {
    if (header === 'valorVenda' && typeof value === 'number') {
      return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
    if (header === 'dataVenda' && value) {
      try { return new Date(value).toLocaleString('pt-BR'); } catch { return value; }
    }
    return value;
  };

  // Ações
  onViewRow = (row: ProdutoVendidoDTO) => {
    this.selecionada = row;
  };

  fechar() { this.selecionada = null; }
}
