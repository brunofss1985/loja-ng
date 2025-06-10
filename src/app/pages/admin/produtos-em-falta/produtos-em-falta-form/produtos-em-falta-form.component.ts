import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Produto } from 'src/app/core/models/product.model';
import { ModalService } from 'src/app/core/services/modalService/modal.service';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-produtos-em-falta-form',
  templateUrl: './produtos-em-falta-form.component.html',
  styleUrls: ['./produtos-em-falta-form.component.scss'],
})
export class ProdutosEmFaltaFormComponent implements OnInit {
  produtos: Produto[] = [];
  produtoForm!: FormGroup;
  imagemFile: File | null = null;
  modalAberto = false;
  editando = false;
  idEditando: number | null = null;
  imagemSelecionada: File | null = null;

  @Input() productToEdit?: Produto;

  @Output() produtoSalvo = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private produtosService: ProdutosService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario(); // 1. Cria o form

    if (this.productToEdit) {
      this.patchFormFromProduct(this.productToEdit); // 2. Só depois preenche
      this.editando = true;
      this.idEditando = this.productToEdit.id ?? null;
    }

    this.carregarProdutos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productToEdit'] && changes['productToEdit'].currentValue) {
      if (this.produtoForm) {
        this.patchFormFromProduct(this.productToEdit!);
        this.editando = true;
        this.idEditando = this.productToEdit?.id ?? null;
      }
    }
  }

  inicializarFormulario() {
    this.produtoForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: [0, Validators.required],
      estoque: [0, Validators.required],
      descricao: ['', Validators.required],
    });
  }

  carregarProdutos() {
    this.produtosService.getAllProdutos().subscribe((res) => {
      this.produtos = res;
    });
  }

  editarProduto(produto: Produto) {
    this.editando = true;
    this.idEditando = produto.id;
    this.produtoForm.patchValue(produto);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.imagemFile = file || null;
  }

  imagemPreview: string | null = null;

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

  private patchFormFromProduct(edit: Produto) {
    this.imagemPreview = edit.imagemUrl || null;

    this.produtoForm.patchValue({
      ...edit,
      imagemUrl: edit.imagemUrl,
      tags: edit.tags?.join(', ') ?? '',
      ingredientes: edit.ingredientes?.join(', ') ?? '',
      galeria: edit.galeria?.join(', ') ?? '',
      comentariosAdmin: edit.comentariosAdmin?.join('\n') ?? '',
      tabelaNutricional: edit.tabelaNutricional
        ? JSON.stringify(edit.tabelaNutricional, null, 2)
        : '',
    });
  }

  salvar() {
    if (this.produtoForm.invalid) return;

    const produtoDto = this.produtoForm.value;
    const formData = new FormData();
    formData.append(
      'produto',
      new Blob([JSON.stringify(produtoDto)], { type: 'application/json' })
    );

    if (this.imagemFile) {
      formData.append('imagem', this.imagemFile);
    }

    if (this.editando && this.idEditando !== null) {
      this.produtosService
        .atualizarComImagem(this.idEditando, formData)
        .subscribe(() => {
          this.carregarProdutos();
          this.produtoSalvo.emit();
        });
    } else {
      this.produtosService.salvarComImagem(formData).subscribe(() => {
        this.carregarProdutos();
        this.produtoSalvo.emit();
      });
    }
  }
}
