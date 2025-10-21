import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Lote } from 'src/app/core/services/lotesService/lotes.service';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';
import { Produto } from 'src/app/core/models/product.model';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-lote-form',
  templateUrl: './lote-form.component.html',
  styleUrls: ['./lote-form.component.scss'],
})
export class LoteFormComponent implements OnInit, OnChanges {
  @Input() loteToEdit?: Lote;
  @Input() quantidadeTotal: number = 0;

  @Output() loteSalvo = new EventEmitter<Lote>();

  form!: FormGroup;
  // Autocomplete de produto
  produtoSearch$ = new Subject<string>();
  produtoSugestoes: Produto[] = [];
  buscandoProdutos = false;
  showSugestoes = false;
  selectedProduto?: Produto | null;

  constructor(private fb: FormBuilder, private produtosService: ProdutosService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.createForm();
    if (this.loteToEdit) this.patchForm(this.loteToEdit);

    // Wire do autocomplete
    this.produtoSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.buscandoProdutos = true)),
        switchMap((term) => {
          const t = (term || '').trim();
          if (t.length < 2) {
            return of(null);
          }
          return this.produtosService.buscarPorTermo(t, 0, 6);
        }),
        tap(() => (this.buscandoProdutos = false)),
        catchError((err) => {
          console.warn('Falha ao buscar produtos:', err);
          this.buscandoProdutos = false;
          return of(null);
        })
      )
      .subscribe((resp) => {
        this.produtoSugestoes = resp?.content || [];
        this.showSugestoes = (this.produtoSugestoes?.length || 0) > 0;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form || !changes['loteToEdit']) return;

    if (this.loteToEdit) {
      this.patchForm(this.loteToEdit);
    } else {
      this.resetForm();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      // produtoId precisa ser > 0 (0/null é inválido)
      produtoId: [null, [Validators.required, Validators.min(1)]],
      dataValidade: ['', Validators.required],
      fornecedor: ['', Validators.required],
      contatoVendedor: ['', Validators.required],
      custoPorUnidade: [0, Validators.required],
      valorVendaSugerido: [0, Validators.required],
      notaFiscalEntrada: ['', Validators.required],
      localArmazenamento: ['', Validators.required],
      statusLote: ['ativo', Validators.required],
      dataRecebimento: ['', Validators.required],

      // Novos campos
      custoTotal: [0],
      lucroTotalEstimado: [0],
      lucroEstimadoPorUnidade: [0],
      codigoBarras: [''],
      cnpjFornecedor: [''],
      dataCadastro: [''],
      dataAtualizacao: ['']
    });
  }

  patchForm(lote: Lote): void {
    this.form.patchValue(lote);
    // Pré-carrega o produto selecionado quando editando
    if (lote?.produtoId) {
      this.produtosService.buscarPorId(String(lote.produtoId)).subscribe({
        next: (p: Produto) => (this.selectedProduto = p),
        error: () => (this.selectedProduto = null),
      });
    }
  }

  resetForm(): void {
    this.form.reset({
      produtoId: null,
      custoPorUnidade: 0,
      valorVendaSugerido: 0,
      statusLote: 'ativo',
    });
    this.selectedProduto = null;
    this.produtoSugestoes = [];
    this.showSugestoes = false;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Mensagem amigável para o usuário
      const produtoIdInvalid = !this.form.get('produtoId')?.value || this.form.get('produtoId')?.invalid;
      const msg = produtoIdInvalid
        ? 'Selecione um produto para o lote.'
        : 'Preencha todos os campos obrigatórios.';
      this.toast.error(msg);
      return;
    }

    const lote: Lote = this.form.getRawValue();
    this.loteSalvo.emit(lote);
    // Não resetar aqui; o componente pai fecha o modal e recarrega a lista em caso de sucesso.
  }

  // Autocomplete handlers
  onProdutoInput(value: string): void {
    this.showSugestoes = true;
    this.produtoSearch$.next(value);
  }

  selecionarProduto(p: Produto): void {
    this.selectedProduto = p;
    this.form.patchValue({ produtoId: p.id });
    this.showSugestoes = false;
  }

  limparProduto(): void {
    this.selectedProduto = null;
    this.form.patchValue({ produtoId: null });
  }

  onBlurAutocomplete(): void {
    // pequeno atraso para permitir click nos itens
    setTimeout(() => (this.showSugestoes = false), 150);
  }

  // Helper para resolver a imagem do produto (URL, dataURL ou base64 + mime)
  getProdutoImgSrc(prod?: Produto | null): string {
    const fallback = 'assets/img/no-image.png';
    if (!prod) return fallback;
    const img = prod.imagem;
    if (img && (img.startsWith('http') || img.startsWith('data:'))) {
      return img;
    }
    // Se veio imagem já como base64 sem prefixo, montar dataURL
    if (prod.imagemBase64 && prod.imagemBase64.length > 20) {
      const mime = prod.imagemMimeType || 'image/png';
      return `data:${mime};base64,${prod.imagemBase64}`;
    }
    // fallback: primeira da galeria
    if (prod.galeriaBase64 && prod.galeriaBase64.length > 0) {
      const mime = (prod.galeriaMimeTypes && prod.galeriaMimeTypes[0]) || 'image/png';
      return `data:${mime};base64,${prod.galeriaBase64[0]}`;
    }
    return fallback;
  }
}
