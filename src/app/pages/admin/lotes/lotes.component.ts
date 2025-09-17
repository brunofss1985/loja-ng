import { Component, OnInit } from '@angular/core';
import { Lote, LotesService } from 'src/app/core/services/lotesService/lotes.service';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss']
})
export class LotesComponent implements OnInit {
  lotes: Lote[] = [];

  form: Lote = {
    codigo: '',
    produtoId: 0,
    quantidade: 0,
    dataValidade: '',

    fornecedor: '',
    custoPorUnidade: 0,
    localArmazenamento: '',
    statusLote: '',
    dataRecebimento: '',
    valorVendaSugerido: 0,
    notaFiscalEntrada: '',
    contatoVendedor: ''
  };

  editando: boolean = false;
  idEditando?: number;

  constructor(private loteService: LotesService) {}

  ngOnInit(): void {
    this.carregarLotes();
  }

  carregarLotes(): void {
    this.loteService.listar().subscribe({
      next: (data) => (this.lotes = data),
      error: (err) => console.error('Erro ao carregar lotes', err)
    });
  }

  onSubmit(): void {
    if (this.editando && this.idEditando) {
      this.loteService.atualizar(this.idEditando, this.form).subscribe({
        next: () => {
          this.cancelarEdicao();
          this.carregarLotes();
        },
        error: (err) => console.error('Erro ao atualizar lote', err)
      });
    } else {
      this.loteService.criar(this.form).subscribe({
        next: () => {
          this.resetForm();
          this.carregarLotes();
        },
        error: (err) => console.error('Erro ao criar lote', err)
      });
    }
  }

  editar(lote: Lote): void {
    this.form = { ...lote };
    this.editando = true;
    this.idEditando = lote.id;
  }

  cancelarEdicao(): void {
    this.resetForm();
    this.editando = false;
    this.idEditando = undefined;
  }

  remover(id?: number): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja excluir este lote?')) {
      this.loteService.remover(id).subscribe({
        next: () => this.carregarLotes(),
        error: (err) => console.error('Erro ao excluir lote', err)
      });
    }
  }

  private resetForm(): void {
    this.form = {
      codigo: '',
      produtoId: 0,
      quantidade: 0,
      dataValidade: '',

      fornecedor: '',
      custoPorUnidade: 0,
      localArmazenamento: '',
      statusLote: '',
      dataRecebimento: '',
      valorVendaSugerido: 0,
      notaFiscalEntrada: '',
      contatoVendedor: ''
    };
  }
}
