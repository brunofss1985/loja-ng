import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produto } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() produtoParaEditar?: Produto;
  @Output() produtoSalvo = new EventEmitter<any>();

  form!: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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
      tabelaNutricional: [''], // Aqui pode ser um JSON string ou campo separado depois
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
        tabelaNutricional: this.produtoParaEditar.tabelaNutricional ? JSON.stringify(this.produtoParaEditar.tabelaNutricional) : '',
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const produto: Produto = {
        ...this.produtoParaEditar,
        ...this.form.value,
        tags: this.form.value.tags
          ? this.form.value.tags.split(',').map((t: string) => t.trim())
          : [],
        ingredientes: this.form.value.ingredientes
          ? this.form.value.ingredientes.split(',').map((i: string) => i.trim())
          : [],
        galeria: this.form.value.galeria
          ? this.form.value.galeria.split(',').map((g: string) => g.trim())
          : [],
        comentariosAdmin: this.form.value.comentariosAdmin
          ? this.form.value.comentariosAdmin.split('\n').map((c: string) => c.trim())
          : [],
        tabelaNutricional: this.form.value.tabelaNutricional
          ? JSON.parse(this.form.value.tabelaNutricional)
          : {},
        criadoEm: this.isEditMode ? this.produtoParaEditar!.criadoEm : new Date(),
        atualizadoEm: new Date(),
      };
      this.produtoSalvo.emit(produto);
      this.form.reset();
      this.isEditMode = false;
    } else {
      this.form.markAllAsTouched();
    }
  }
}
