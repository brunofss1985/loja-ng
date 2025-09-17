import {
  ChangeDetectorRef,
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
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() produtoSalvo = new EventEmitter<Produto>();
  @Input() productToEdit?: Produto;

  form!: FormGroup;
  imagemSelecionada: File | null = null;
  imagemPreview: string | null = null;

  galeriaSelecionada: File[] = [];
  galeriaPreviewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService,
    private toastService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      slug: [''],
      descricao: ['', Validators.required],
      descricaoCurta: [''],
      categorias: [[]],
      objetivos: [[]],
      peso: ['', Validators.required],
      sabor: [''],
      preco: [0, [Validators.required, Validators.min(0)]],
      precoDesconto: [0],
      porcentagemDesconto: [{ value: '0%', disabled: true }],
      custo: [0],
      fornecedor: [''],
      lucroEstimado: [0],
      statusAprovacao: ['pendente'],
      tamanhoPorcao: [''],
      galeria: [[]],
      ativo: [true],
      destaque: [false],
      disponibilidade: ['em_estoque'],

      // ✅ estoqueTotal agora é readonly
      estoqueTotal: [{ value: 0, disabled: true }],
      estoqueMinimo: [null],
      estoqueMaximo: [null],

      localizacaoFisica: [''],
      codigoBarras: [''],
      dimensoes: this.fb.group({
        altura: [null],
        largura: [null],
        profundidade: [null],
      }),
      restricoes: [[]],
      tabelaNutricional: [null],
      modoDeUso: [''],
      palavrasChave: [[]],
      avaliacoes: this.fb.group({
        media: [null],
        comentarios: [[]],
      }),
      dataCadastro: [null],
      dataUltimaAtualizacao: [null],
      dataValidade: [null],
      fornecedorId: [null],
      cnpjFornecedor: [''],
      contatoFornecedor: [''],
      prazoEntregaFornecedor: [''],
      quantidadeVendida: [null],
      vendasMensais: [[]],
    });
  }

  ngOnInit(): void {
    if (this.productToEdit) this.patchFormFromProduct(this.productToEdit);

    this.form.get('preco')?.valueChanges.subscribe(() => {
      this.calcularPorcentagemDesconto();
    });

    this.form.get('precoDesconto')?.valueChanges.subscribe(() => {
      this.calcularPorcentagemDesconto();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit']) {
      if (this.productToEdit) this.patchFormFromProduct(this.productToEdit);
      else this.resetFormToDefaults();
    }
  }

  patchFormFromProduct(edit: Produto): void {
    const {
      imagemBase64,
      imagemMimeType,
      galeriaBase64,
      galeriaMimeTypes,
      ...formValues
    } = edit;

    this.form.patchValue({
      ...formValues,
      estoqueTotal: edit.estoqueTotal ?? 0,
      categorias: edit.categorias?.join(', ') ?? '',
      objetivos: edit.objetivos?.join(', ') ?? '',
      dimensoes: edit.dimensoes ?? {
        altura: null,
        largura: null,
        profundidade: null,
      },
      avaliacoes: {
        media: edit.avaliacoes?.media ?? null,
        comentarios: edit.avaliacoes?.comentarios ?? [],
      },
      restricoes: edit.restricoes?.join(', ') ?? '',
      palavrasChave: edit.palavrasChave?.join(', ') ?? '',
      vendasMensais: edit.vendasMensais?.join(', ') ?? '',
      porcentagemDesconto: edit.porcentagemDesconto
        ? `${edit.porcentagemDesconto}%`
        : '0%',
    });

    // ✅ imagem principal
    if (imagemBase64 && imagemMimeType && !this.imagemSelecionada) {
      this.imagemPreview = `data:${imagemMimeType};base64,${imagemBase64}`;
    }

    // ✅ galeria de imagens
    this.galeriaPreviewUrls = [];
    if (Array.isArray(galeriaBase64) && galeriaBase64.length > 0) {
      this.galeriaPreviewUrls = galeriaBase64.map(
        (base64Data, i) =>
          `data:${galeriaMimeTypes?.[i] || 'image/jpeg'};base64,${base64Data}`
      );
    }

    this.calcularPorcentagemDesconto();
    setTimeout(() => this.cdr.detectChanges(), 100);
  }

  resetFormToDefaults(): void {
    this.form.reset({
      id: null,
      nome: '',
      marca: '',
      slug: '',
      descricao: '',
      descricaoCurta: '',
      categorias: [],
      objetivos: [],
      peso: '',
      sabor: '',
      tamanhoPorcao: '',
      preco: 0,
      precoDesconto: 0,
      porcentagemDesconto: '0%',
      custo: 0,
      fornecedor: '',
      lucroEstimado: 0,
      statusAprovacao: 'pendente',
      galeria: [],
      ativo: true,
      destaque: false,
      disponibilidade: 'em_estoque',
      estoqueTotal: 0,
      estoqueMinimo: null,
      estoqueMaximo: null,
      localizacaoFisica: '',
      codigoBarras: '',
      dimensoes: { altura: null, largura: null, profundidade: null },
      restricoes: [],
      tabelaNutricional: null,
      modoDeUso: '',
      palavrasChave: [],
      avaliacoes: { media: null, comentarios: [] },
      dataCadastro: null,
      dataUltimaAtualizacao: null,
      dataValidade: null,
      fornecedorId: null,
      cnpjFornecedor: '',
      contatoFornecedor: '',
      prazoEntregaFornecedor: '',
      quantidadeVendida: null,
      vendasMensais: [],
    });

    this.imagemSelecionada = null;
    this.imagemPreview = null;
    this.galeriaSelecionada = [];
    this.galeriaPreviewUrls = [];
  }

  onImagemSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.imagemSelecionada = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result as string;
      };
      reader.readAsDataURL(this.imagemSelecionada);
    }
  }

  onGaleriaSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        if (!this.galeriaSelecionada.find((f) => f.name === file.name)) {
          this.galeriaSelecionada.push(file);

          const reader = new FileReader();
          reader.onload = () => {
            this.galeriaPreviewUrls.push(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      });

      const nomes = this.galeriaSelecionada.map((f) => f.name);
      this.form.get('galeria')?.setValue(nomes);
    }
  }

  removerImagemGaleria(index: number): void {
    this.galeriaSelecionada.splice(index, 1);
    this.galeriaPreviewUrls.splice(index, 1);
    const nomesAtualizados = this.galeriaSelecionada.map((f) => f.name);
    this.form.get('galeria')?.setValue(nomesAtualizados);
  }

  get dimensoesGroup(): FormGroup {
    return this.form.get('dimensoes') as FormGroup;
  }

  private calcularPorcentagemDesconto(): void {
    const preco = this.form.get('preco')?.value;
    const precoDesconto = this.form.get('precoDesconto')?.value;

    if (preco > 0 && precoDesconto < preco) {
      const desconto = ((preco - precoDesconto) / preco) * 100;
      this.form.get('porcentagemDesconto')?.patchValue(desconto.toFixed(2));
    } else {
      this.form.get('porcentagemDesconto')?.patchValue('0%');
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.toastService.error('Preencha corretamente todos os campos.');
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    ['categorias', 'objetivos', 'restricoes', 'palavrasChave'].forEach(
      (campo) => {
        if (typeof formValue[campo] === 'string') {
          formValue[campo] = formValue[campo]
            .split(',')
            .map((v: string) => v.trim())
            .filter((v: string) => v.length > 0);
        }
      }
    );

    if (typeof formValue.vendasMensais === 'string') {
      formValue.vendasMensais = formValue.vendasMensais
        .split(',')
        .map((val: string) => parseInt(val.trim(), 10))
        .filter((n: number) => !isNaN(n));
    }

    if (formValue.dimensoes) {
      const { altura, largura, profundidade } = formValue.dimensoes;
      formValue.dimensoes = {
        altura: altura ? Number(altura) : null,
        largura: largura ? Number(largura) : null,
        profundidade: profundidade ? Number(profundidade) : null,
      };
    }

    const produto: Produto = {
      ...formValue,
      id: formValue.id ?? 0,
      preco: Number(formValue.preco),
      precoDesconto: Number(formValue.precoDesconto || 0),
      porcentagemDesconto: formValue.porcentagemDesconto,
      custo: Number(formValue.custo || 0),
      lucroEstimado: Number(formValue.lucroEstimado || 0),
      statusAprovacao: formValue.statusAprovacao || 'pendente',
      restricoes: formValue.restricoes,
      palavrasChave: formValue.palavrasChave,
      vendasMensais: formValue.vendasMensais,
      objetivos: formValue.objetivos,
      destaque: formValue.destaque,
    };

    const formData = new FormData();
    formData.append(
      'produto',
      new Blob([JSON.stringify(produto)], { type: 'application/json' })
    );

    if (this.imagemSelecionada) {
      formData.append('imagem', this.imagemSelecionada);
    }

    this.galeriaSelecionada.forEach((file) => {
      formData.append('galeria', file);
    });

    const acao =
      produto.id && produto.id > 0
        ? this.produtosService.atualizarComImagem(produto.id, formData)
        : this.produtosService.salvarComImagem(formData);

    acao.subscribe({
      next: (res: Produto) => {
        const msg = produto.id
          ? 'Produto atualizado com sucesso!'
          : 'Produto cadastrado com sucesso!';
        this.toastService.success(msg);
        this.produtoSalvo.emit(res);
        this.resetFormToDefaults();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erro ao salvar o produto.');
      },
    });
  }
}
