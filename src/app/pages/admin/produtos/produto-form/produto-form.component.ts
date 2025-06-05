import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  @Output() produtoSalvo = new EventEmitter<void>();

  @Input() productToEdit?: any;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService,
    private toastService: ToastrService
  ) {
    this.form = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl('', Validators.required),
      slug: new FormControl(''),
      descricao: new FormControl('', Validators.required),
      descricaoCurta: new FormControl(''),
      categoria: new FormControl('', Validators.required),
      tags: new FormControl(''),
      peso: new FormControl('', Validators.required),
      sabor: new FormControl(''),
      tamanhoPorcao: new FormControl(''),
      ingredientes: new FormControl(''),
      tabelaNutricional: new FormControl(''),
      preco: new FormControl(0, [Validators.required, Validators.min(0)]),
      precoDesconto: new FormControl(0),
      estoque: new FormControl(0, [Validators.required, Validators.min(0)]),
      qtdMinimaEstoque: new FormControl(0),
      custo: new FormControl(0),
      fornecedor: new FormControl(''),
      lucroEstimado: new FormControl(0),
      sku: new FormControl(''),
      codigoBarras: new FormControl(''),
      imagemUrl: new FormControl(''),
      galeria: new FormControl(''),
      destaque: new FormControl(false),
      novoLancamento: new FormControl(false),
      maisVendido: new FormControl(false),
      promocaoAtiva: new FormControl(false),
      dataExpiracao: new FormControl(null),
      ultimaCompra: new FormControl(null),
      quantidadeVendida: new FormControl(0),
      comentariosAdmin: new FormControl(''),
      statusAprovacao: new FormControl('pendente'),
      publicado: new FormControl(false),
      avaliacaoMedia: new FormControl(0),
      quantidadeAvaliacoes: new FormControl(0),
      ativo: new FormControl(true),
      criadoEm: new FormControl(null),
      atualizadoEm: new FormControl(null),
    });
  }
ngOnInit(): void {
  // Se necessário, chame algum método para carregar dados aqui
  if (this.productToEdit) {
    this.form.patchValue(this.productToEdit);
  }
}

submit() {
  if (this.form.invalid) {
    this.toastService.error('Preencha corretamente todos os campos.');
    this.form.markAllAsTouched();
    return;
  }

  const formValue = this.form.value;

  // Valida JSON da tabelaNutricional
  let tabelaNutricionalConvertida: { [key: string]: string | number } = {};
  try {
    tabelaNutricionalConvertida = formValue.tabelaNutricional
      ? JSON.parse(formValue.tabelaNutricional)
      : {};
  } catch (e) {
    this.toastService.error('Campo "Tabela Nutricional" deve ser um JSON válido!');
    return;
  }

  const produto: Produto = {
    ...formValue,

    id: formValue.id ?? 0,

    // Conversões numéricas seguras
    preco: Number(formValue.preco),
    precoDesconto: formValue.precoDesconto ? Number(formValue.precoDesconto) : 0,
    estoque: Number(formValue.estoque),
    qtdMinimaEstoque: Number(formValue.qtdMinimaEstoque || 0),
    custo: Number(formValue.custo || 0),
    lucroEstimado: Number(formValue.lucroEstimado || 0),
    quantidadeVendida: Number(formValue.quantidadeVendida || 0),
    avaliacaoMedia: Number(formValue.avaliacaoMedia || 0),
    quantidadeAvaliacoes: Number(formValue.quantidadeAvaliacoes || 0),

    // Strings separadas por vírgula → arrays
    tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [],
    ingredientes: formValue.ingredientes ? formValue.ingredientes.split(',').map((i: string) => i.trim()) : [],
    galeria: formValue.galeria ? formValue.galeria.split(',').map((g: string) => g.trim()) : [],
    comentariosAdmin: formValue.comentariosAdmin
      ? formValue.comentariosAdmin.split('\n').map((c: string) => c.trim())
      : [],

    tabelaNutricional: tabelaNutricionalConvertida,

    // Datas
    dataExpiracao: formValue.dataExpiracao ? new Date(formValue.dataExpiracao) : null,
    ultimaCompra: formValue.ultimaCompra ? new Date(formValue.ultimaCompra) : null,
    criadoEm: formValue.criadoEm ? new Date(formValue.criadoEm) : new Date(),
    atualizadoEm: new Date(),

    // Campos booleanos (garante valor mesmo se não marcados)
    destaque: !!formValue.destaque,
    novoLancamento: !!formValue.novoLancamento,
    maisVendido: !!formValue.maisVendido,
    promocaoAtiva: !!formValue.promocaoAtiva,
    publicado: !!formValue.publicado,
    ativo: formValue.ativo !== false,

    // Campo status com valor padrão
    statusAprovacao: formValue.statusAprovacao || 'pendente',
  };

  const produtoParaEnviar = {
    ...produto,
    tabelaNutricional: JSON.stringify(produto.tabelaNutricional || {})
  };

  // Verificação de edição ou novo cadastro
  if (produto.id && produto.id > 0) {
    this.produtosService.updateProduto(produto.id, produtoParaEnviar).subscribe({
      next: (res) => {
        this.toastService.success('Produto atualizado com sucesso!');
        this.produtoSalvo.emit(res);
        this.form.reset();
        // this.fecharModal();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erro ao atualizar o produto.');
      }
    });
  } else {
    this.produtosService.createProduto(produtoParaEnviar).subscribe({
      next: (res) => {
        this.toastService.success('Produto cadastrado com sucesso!');
        this.produtoSalvo.emit(res);
        this.form.reset();
        // this.fecharModal();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Erro ao cadastrar o produto.');
      }
    });
  }
}


  ngOnChanges(changes: SimpleChanges): void {
  if (changes['productToEdit'] && this.productToEdit) {
    const edit = this.productToEdit;

    this.form.patchValue({
      ...edit,
      tags: edit.tags?.join(', '),
      ingredientes: edit.ingredientes?.join(', '),
      galeria: edit.galeria?.join(', '),
      comentariosAdmin: edit.comentariosAdmin?.join('\n'),
      tabelaNutricional: edit.tabelaNutricional
        ? JSON.stringify(edit.tabelaNutricional, null, 2)
        : '',
    });
  }
}

  }
