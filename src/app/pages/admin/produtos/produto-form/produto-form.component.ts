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
    private toastService: ToastrService
  ) {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      slug: [''],
      descricao: ['', Validators.required],
      descricaoCurta: [''],
      categoria: ['', Validators.required],
      peso: ['', Validators.required],
      sabor: [''],
      preco: [0, [Validators.required, Validators.min(0)]],
      precoDesconto: [0],
      custo: [0],
      fornecedor: [''],
      lucroEstimado: [0],
      statusAprovacao: ['pendente'],
      tamanhoPorcao: [''],
      imagemUrl: [''],
      galeria: [[]],
      // tags: [''],
      // ingredientes: [''],
      // tabelaNutricional: [''],
      // estoque: [0, [Validators.required, Validators.min(0)]],
      // qtdMinimaEstoque: [0],
      // sku: [''],
      // codigoBarras: [''],
      // galeria: [''],
      // destaque: [false],
      // novoLancamento: [false],
      // maisVendido: [false],
      // promocaoAtiva: [false],
      // dataExpiracao: [null],
      // ultimaCompra: [null],
      // quantidadeVendida: [0],
      // comentariosAdmin: [''],
      // publicado: [false],
      // avaliacaoMedia: [0],
      // quantidadeAvaliacoes: [0],
      // ativo: [true],
      // criadoEm: [null],
      // atualizadoEm: [null],
    });
  }

  ngOnInit(): void {
    if (this.productToEdit) this.patchFormFromProduct(this.productToEdit);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit']) {
      if (this.productToEdit) this.patchFormFromProduct(this.productToEdit);
      else this.resetFormToDefaults();
    }
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

      // ⚡ Aqui colocamos o nome do arquivo no campo "imagemUrl"
      this.form.get('imagemUrl')?.setValue(this.imagemSelecionada.name);
    }
  }

  onGaleriaSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        // Evita arquivos duplicados
        if (!this.galeriaSelecionada.find((f) => f.name === file.name)) {
          this.galeriaSelecionada.push(file);

          const reader = new FileReader();
          reader.onload = () => {
            this.galeriaPreviewUrls.push(reader.result as string);
          };
          reader.readAsDataURL(file);

        }
      });

      // Atualiza os nomes no formulário
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

private patchFormFromProduct(edit: Produto) {
  this.imagemPreview = edit.imagemUrl || null;

  this.form.patchValue({
    ...edit,
    galeria: edit.galeria ?? [],
  });

  // Resetando galerias locais
  this.galeriaPreviewUrls = [];
  this.galeriaSelecionada = [];

  if (edit.galeria && edit.galeria.length) {
    for (const imageName of edit.galeria) {
      // Se os nomes já são URLs completas, use diretamente:
      const url = imageName.startsWith('http')
        ? imageName
        : `http://localhost:8080/imagens/${imageName}`;

      this.galeriaPreviewUrls.push(url);
    }
  }
}


  submit(): void {
    console.log('teste', this.form.value);
    if (this.form.invalid) {
      this.toastService.error('Preencha corretamente todos os campos.');
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    // let tabelaNutricionalConvertida: Record<string, any> = {};
    // try {
    //   tabelaNutricionalConvertida = formValue.tabelaNutricional
    //     ? JSON.parse(formValue.tabelaNutricional)
    //     : {};
    // } catch {
    //   this.toastService.error(
    //     'Campo "Tabela Nutricional" deve ser um JSON válido!'
    //   );
    //   return;
    // }

    const safeSplit = (value: any, sep = ',') =>
      typeof value === 'string'
        ? value
            .split(sep)
            .map((v: string) => v.trim())
            .filter((v) => v.length)
        : Array.isArray(value)
        ? value
        : [];

    const produto: Produto = {
      ...formValue,
      id: formValue.id ?? 0,
      preco: Number(formValue.preco),
      precoDesconto: Number(formValue.precoDesconto || 0),
      // estoque: Number(formValue.estoque),
      // qtdMinimaEstoque: Number(formValue.qtdMinimaEstoque || 0),
      custo: Number(formValue.custo || 0),
      galeria: formValue.galeria,
      imagemUrl: formValue.imagemUrl,
      // lucroEstimado: Number(formValue.lucroEstimado || 0),
      // quantidadeVendida: Number(formValue.quantidadeVendida || 0),
      // avaliacaoMedia: Number(formValue.avaliacaoMedia || 0),
      // quantidadeAvaliacoes: Number(formValue.quantidadeAvaliacoes || 0),
      // tags: safeSplit(formValue.tags),
      // ingredientes: safeSplit(formValue.ingredientes),
      // galeria: safeSplit(formValue.galeria),
      // comentariosAdmin: safeSplit(formValue.comentariosAdmin, '\n'),
      // tabelaNutricional: tabelaNutricionalConvertida,
      // dataExpiracao: formValue.dataExpiracao
      //   ? new Date(formValue.dataExpiracao)
      //   : null,
      // ultimaCompra: formValue.ultimaCompra
      //   ? new Date(formValue.ultimaCompra)
      //   : null,
      // criadoEm: formValue.criadoEm ? new Date(formValue.criadoEm) : new Date(),
      // atualizadoEm: new Date(),
      // destaque: !!formValue.destaque,
      // novoLancamento: !!formValue.novoLancamento,
      // maisVendido: !!formValue.maisVendido,
      // promocaoAtiva: !!formValue.promocaoAtiva,
      // publicado: !!formValue.publicado,
      ativo: formValue.ativo !== false,
      statusAprovacao: formValue.statusAprovacao || 'pendente',
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
      formData.append('galeria', file); // mesmo nome, tipo array
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

  resetFormToDefaults(): void {
    this.form.reset({
      nome: '',
      slug: '',
      descricao: '',
      descricaoCurta: '',
      categoria: '',
      peso: '',
      sabor: '',
      tamanhoPorcao: '',
      preco: 0,
      precoDesconto: 0,
      custo: 0,
      fornecedor: '',
      lucroEstimado: 0,
      statusAprovacao: 'pendente',
      imagemUrl: '',
      // tags: '',
      // ingredientes: '',
      // tabelaNutricional: '',
      // estoque: 0,
      // qtdMinimaEstoque: 0,
      // sku: '',
      // codigoBarras: '',
      // galeria: '',
      // destaque: false,
      // novoLancamento: false,
      // maisVendido: false,
      // promocaoAtiva: false,
      // dataExpiracao: null,
      // ultimaCompra: null,
      // quantidadeVendida: 0,
      // comentariosAdmin: '',
      // publicado: false,
      // avaliacaoMedia: 0,
      // quantidadeAvaliacoes: 0,
      // ativo: true,
      // criadoEm: null,
      // atualizadoEm: null,
    });
    this.imagemSelecionada = null;
  }

  //   id: [null],
  // nome: ['', Validators.required],
  // slug: [''],
  // descricao: ['', Validators.required],
  // descricaoCurta: [''],
  // categoria: ['', Validators.required],
  // peso: ['', Validators.required],
  // sabor: [''],
  // preco: [0, [Validators.required, Validators.min(0)]],
  // precoDesconto: [0],
  // custo: [0],
  // fornecedor: [''],
  // lucroEstimado: [0],
  // statusAprovacao: ['pendente'],
  // tamanhoPorcao: [''],
}
