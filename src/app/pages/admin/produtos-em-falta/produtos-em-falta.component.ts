import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produto } from 'src/app/core/models/product.model';
import { ProdutosService } from 'src/app/core/services/produtosService/produtos.service';

@Component({
  selector: 'app-produtos-em-falta',
  templateUrl: './produtos-em-falta.component.html',
  styleUrls: ['./produtos-em-falta.component.scss']
})
export class ProdutosEmFaltaComponent implements OnInit {
  produtos: Produto[] = [];
  produtoForm!: FormGroup;
  imagemFile: File | null = null;
  modalAberto = false;
  editando = false;
  idEditando: number | null = null;

  constructor(private fb: FormBuilder, private produtosService: ProdutosService) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.produtoForm = this.fb.group({
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

  abrirModal() {
    this.modalAberto = true;
    this.editando = false;
    this.idEditando = null;
    this.produtoForm.reset();
    this.imagemFile = null;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  editarProduto(produto: Produto) {
    this.abrirModal();
    this.editando = true;
    this.idEditando = produto.id;
    this.produtoForm.patchValue(produto);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.imagemFile = file || null;
  }

  salvar() {
    if (this.produtoForm.invalid) return;

    const produtoDto = this.produtoForm.value;
    const formData = new FormData();
    formData.append('produto', new Blob([JSON.stringify(produtoDto)], { type: 'application/json' }));

    if (this.imagemFile) {
      formData.append('imagem', this.imagemFile);
    }

    if (this.editando && this.idEditando !== null) {
      this.produtosService.atualizarComImagem(this.idEditando, formData).subscribe(() => {
        this.carregarProdutos();
        this.fecharModal();
      });
    } else {
      this.produtosService.salvarComImagem(formData).subscribe(() => {
        this.carregarProdutos();
        this.fecharModal();
      });
    }
  }

  removerProduto(id: number) {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.produtosService.deleteProduto(String(id)).subscribe(() => {
        this.carregarProdutos();
      });
    }
  }
}
