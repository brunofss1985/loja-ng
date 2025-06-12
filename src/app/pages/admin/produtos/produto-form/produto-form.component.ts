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
      galeria: [[]],
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

patchFormFromProduct(edit: Produto): void {
  this.form.patchValue({
    ...edit,
    galeria: [],
  });

  // Imagem principal (thumbnail)
  this.imagemPreview = null;
  if (edit.imagem && edit.imagemMimeType && edit.imagem.length > 0) {
    const base64 = this.arrayBufferToBase64(edit.imagem);
    if (base64) {
      this.imagemPreview = `data:${edit.imagemMimeType};base64,${base64}`;
    }
  }

  // Galeria de imagens
  this.galeriaPreviewUrls = [];
  this.galeriaSelecionada = [];

  if (edit.galeria && edit.galeria.length) {
    for (let i = 0; i < edit.galeria.length; i++) {
      const buffer = edit.galeria[i];
      const mime = edit.galeriaMimeTypes?.[i] || 'image/jpeg';
      if (buffer && buffer.length > 0) {
        const base64 = this.arrayBufferToBase64(buffer);
        if (base64) {
          this.galeriaPreviewUrls.push(`data:${mime};base64,${base64}`);
        }
      }
    }
  }
}

  submit(): void {
    if (this.form.invalid) {
      this.toastService.error('Preencha corretamente todos os campos.');
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const produto: Produto = {
      ...formValue,
      id: formValue.id ?? 0,
      preco: Number(formValue.preco),
      precoDesconto: Number(formValue.precoDesconto || 0),
      custo: Number(formValue.custo || 0),
      lucroEstimado: Number(formValue.lucroEstimado || 0),
      statusAprovacao: formValue.statusAprovacao || 'pendente',
      ativo: true,
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
      galeria: [],
    });

    this.imagemSelecionada = null;
    this.imagemPreview = null;
    this.galeriaSelecionada = [];
    this.galeriaPreviewUrls = [];
  }

  // Converte ArrayBuffer para Base64 (byte[] vindo do backend)
arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

}
