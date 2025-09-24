import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LotesService,
  Lote,
} from 'src/app/core/services/lotesService/lotes.service';
import { ToastrService } from 'ngx-toastr';
import { LoteFormComponent } from '../lotes-form/lote-form.component';
import { ProdutoReal } from 'src/app/core/models/produto-real.model';
import { ProdutoRealService } from 'src/app/core/services/produto-real/produto-real.service';

@Component({
  selector: 'app-edit-lote-eproduto-lote',
  templateUrl: './edit-lote-eproduto-lote.component.html',
  styleUrls: ['./edit-lote-eproduto-lote.component.scss'],
})
export class EditLoteEProdutoLoteComponent implements OnInit {
  @ViewChild(LoteFormComponent) loteFormComponent!: LoteFormComponent;

  produtosReais: ProdutoReal[] = [];
  lote?: Lote;
  loading: boolean = true;
  formularioProdutoAberto = false;

  // 🔹 Configurações da tabela reutilizável
  columnsProdutos: string[] = ['id', 'codigoBarras', 'quantidade'];
  columnLabelsProdutos: { [key: string]: string } = {
    id: 'ID',
    codigoBarras: 'Código de Barras',
    quantidade: 'Quantidade',
  };

  currentPage = 0;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private loteService: LotesService,
    private toast: ToastrService,
    private produtoRealService: ProdutoRealService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loteService.buscarPorId(id).subscribe({
      next: (data) => {
        this.lote = data;
        this.carregarProdutosReais();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar lote.');
        this.router.navigate(['/lotes']);
      },
    });
  }

  carregarProdutosReais(): void {
    if (!this.lote?.id) return;

    this.produtoRealService.listarPorLote(this.lote.id).subscribe({
      next: (produtos) => {
        this.produtosReais = produtos;
      },
      error: () => {
        this.toast.error('Erro ao carregar produtos reais.');
      },
    });
  }

  get totalQuantidadeProdutosReais(): number {
    return this.produtosReais.reduce((acc, p) => acc + p.quantidade, 0);
  }

  salvar(): void {
    this.loteFormComponent.submit();
  }

  onLoteSalvo(loteEditado: Lote): void {
    this.loteService.atualizar(loteEditado.id!, loteEditado).subscribe({
      next: () => {
        this.toast.success('Lote atualizado com sucesso!');
        this.router.navigate(['/lotes']);
      },
      error: () => {
        this.toast.error('Erro ao atualizar lote.');
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/lotes']);
  }

  abrirFormularioProduto(): void {
    this.formularioProdutoAberto = true;
  }

  salvarProdutoReal(produto: ProdutoReal): void {
    this.produtoRealService.cadastrar(produto).subscribe({
      next: () => {
        this.toast.success('Produto real salvo com sucesso!');
        this.formularioProdutoAberto = false;
        this.carregarProdutosReais();
      },
      error: () => {
        this.toast.error('Erro ao salvar produto real.');
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
  }
}
