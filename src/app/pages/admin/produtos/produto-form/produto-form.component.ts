import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  @Input() produtoParaEditar?: Produto;
  @Output() produtoSalvo = new EventEmitter<any>();

  form!: FormGroup;
  isEditMode: boolean = false;
  allProdutos: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.produtosService.getAllProdutos().subscribe((res) => {
      this.allProdutos = res;
    });

    this.form = this.fb.group({
      nome: ['', Validators.required],
      slug: [''],
      descricao: ['', Validators.required],
      descricaoCurta: [''],
      categoria: ['', Validators.required],
      tags: [''],
      peso: ['', Validators.required],
      sabor: [''],
      tamanhoPorcao: [''],
      ingredientes: [''],
      tabelaNutricional: [''],
      preco: [0, [Validators.required, Validators.min(0)]],
      precoDesconto: [0],
      estoque: [0, [Validators.required, Validators.min(0)]],
      qtdMinimaEstoque: [0],
      custo: [0],
      fornecedor: [''],
      lucroEstimado: [0],
      sku: [''],
      codigoBarras: [''],
      imagemUrl: [''],
      galeria: [''],
      destaque: [false],
      novoLancamento: [false],
      maisVendido: [false],
      promocaoAtiva: [false],
      dataExpiracao: [null],
      ultimaCompra: [null],
      quantidadeVendida: [0],
      comentariosAdmin: [''],
      statusAprovacao: ['pendente'],
      publicado: [false],
      avaliacaoMedia: [0],
      quantidadeAvaliacoes: [0],
      ativo: [true],
      criadoEm: [null],
      atualizadoEm: [null],
    });

    if (this.produtoParaEditar) {
      this.isEditMode = true;
      this.form.patchValue({
        ...this.produtoParaEditar,
        tags: this.produtoParaEditar.tags?.join(', '),
        ingredientes: this.produtoParaEditar.ingredientes?.join(', '),
        galeria: this.produtoParaEditar.galeria?.join(', '),
        comentariosAdmin: this.produtoParaEditar.comentariosAdmin?.join('\n'),
        tabelaNutricional: this.produtoParaEditar.tabelaNutricional
          ? JSON.stringify(this.produtoParaEditar.tabelaNutricional)
          : '',
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const produto: Produto = {
        ...this.produtoParaEditar,
        ...formValue,

        // 🧹 Converte campos de string para número
        preco: Number(formValue.preco),
        precoDesconto: Number(formValue.precoDesconto),
        estoque: Number(formValue.estoque),
        qtdMinimaEstoque: Number(formValue.qtdMinimaEstoque),
        custo: Number(formValue.custo),
        lucroEstimado: Number(formValue.lucroEstimado),
        quantidadeVendida: Number(formValue.quantidadeVendida),
        avaliacaoMedia: Number(formValue.avaliacaoMedia),
        quantidadeAvaliacoes: Number(formValue.quantidadeAvaliacoes),

        // 🧹 Converte campos de texto para array
        tags: formValue.tags
          ? formValue.tags.split(',').map((t: string) => t.trim())
          : [],
        ingredientes: formValue.ingredientes
          ? formValue.ingredientes.split(',').map((i: string) => i.trim())
          : [],
        galeria: formValue.galeria
          ? formValue.galeria.split(',').map((g: string) => g.trim())
          : [],
        comentariosAdmin: formValue.comentariosAdmin
          ? formValue.comentariosAdmin.split('\n').map((c: string) => c.trim())
          : [],

        // 🧹 Tabela Nutricional
        tabelaNutricional: (() => {
          try {
            return formValue.tabelaNutricional
              ? JSON.parse(formValue.tabelaNutricional)
              : {};
          } catch (e) {
            alert('Campo "Tabela Nutricional" deve ser um JSON válido!');
            throw e;
          }
        })(),
        

        // 🧹 Datas
        dataExpiracao: formValue.dataExpiracao || null,
        ultimaCompra: formValue.ultimaCompra || null,
        criadoEm: this.isEditMode
          ? this.produtoParaEditar!.criadoEm
          : new Date(),
        atualizadoEm: new Date(),
      };

      const produtoParaEnviar = {
        ...produto,
        tabelaNutricional: JSON.stringify(produto.tabelaNutricional || {}),
      };

      if (this.isEditMode && produto.id) {
        // Edição
        this.produtosService
          .updateProduto(produto.id, produtoParaEnviar)
          .subscribe({
            next: (res) => {
              this.produtoSalvo.emit(res);
              this.form.reset();
              this.isEditMode = false;
            },
            error: (err) => {
              console.error('Erro ao atualizar produto:', err);
            },
          });
      } else {
        // Cadastro novo
        this.produtosService.createProduto(produtoParaEnviar).subscribe({
          next: (res) => {
            this.produtoSalvo.emit(res);
            this.form.reset();
            this.isEditMode = false;
          },
          error: (err) => {
            console.error('Erro ao criar produto:', err);
          },
        });
      }
    } else {
      alert('Preenche direito');
      this.form.markAllAsTouched();
    }
  }


}
