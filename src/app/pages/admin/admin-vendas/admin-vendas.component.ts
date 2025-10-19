import { Component, OnInit } from '@angular/core';
import { VendasService, ProdutoVendidoDTO } from 'src/app/core/services/vendasService/vendas.service';

@Component({
  selector: 'app-admin-vendas',
  templateUrl: './admin-vendas.component.html',
  styleUrls: ['./admin-vendas.component.scss']
})
export class AdminVendasComponent implements OnInit {
  vendas: ProdutoVendidoDTO[] = [];
  errorMessage = '';
  selecionada: ProdutoVendidoDTO | null = null;

  constructor(private vendasService: VendasService) {}

  ngOnInit(): void {
    this.vendasService.listar().subscribe({
      next: v => this.vendas = v,
      error: err => this.errorMessage = 'Erro ao carregar vendas: ' + (err?.message || err)
    });
  }

  visualizar(v: ProdutoVendidoDTO) {
    this.selecionada = v;
  }

  fechar() { this.selecionada = null; }
}
