import { Component, OnInit, ViewChild } from '@angular/core';
import { LotesService, Lote } from 'src/app/core/services/lotesService/lotes.service';
import { ToastrService } from 'ngx-toastr';
import { LoteFormComponent } from '../lotes-form/lote-form.component';
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss'],
})
export class LotesComponent implements OnInit {
  @ViewChild(LoteFormComponent) loteFormComponent!: LoteFormComponent;

  allLotes: Lote[] = [];
  columns: string[] = [
    'id', 'codigo', 'produtoId', 'produtoNome', 'quantidade', 'dataValidade', 'fornecedor',
    'custoPorUnidade', 'localArmazenamento', 'statusLote', 'dataRecebimento',
    'valorVendaSugerido', 'notaFiscalEntrada', 'contatoVendedor'
  ];
  columnLabels: { [key: string]: string } = {
    id: 'ID',
    codigo: 'Código',
    produtoId: 'Produto ID',
      produtoNome: 'Produto',
      quantidade: 'Quantidade',
    dataValidade: 'Validade',
    fornecedor: 'Fornecedor',
    custoPorUnidade: 'Custo/Unid',
    localArmazenamento: 'Local',
    statusLote: 'Status',
    dataRecebimento: 'Recebimento',
    valorVendaSugerido: 'Venda Sug.',
    notaFiscalEntrada: 'Nota Fiscal',
    contatoVendedor: 'Contato'
  };

  loteSelecionado?: Lote;
  modalAberto: boolean = false;

  constructor(private loteService: LotesService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.carregarLotes();
  }

  carregarLotes(): void {
    this.loteService.listar().subscribe({
      next: (data) => (this.allLotes = data),
      error: (err) => console.error('Erro ao carregar lotes', err)
    });
  }

  onClickCadastrar(): void {
    this.loteSelecionado = undefined;
    this.modalAberto = true;
  }

  onModalAbertoChange(valor: boolean): void {
    this.modalAberto = valor;
    if (!valor) {
      this.loteSelecionado = undefined;
    }
  }

  onLoteSalvo(lote: Lote): void {
    const request = lote.id
      ? this.loteService.atualizar(lote.id, lote)
      : this.loteService.criar(lote);

    request.subscribe({
      next: () => {
        this.toast.success(`Lote ${lote.id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.modalAberto = false;
        this.carregarLotes();
      },
      error: (err) => {
        this.toast.error('Erro ao salvar lote.');
        console.error(err);
      }
    });
  }

  onDeleteLote(id: number): void {
    if (confirm('Tem certeza que deseja excluir este lote?')) {
      this.loteService.remover(id).subscribe({
        next: () => {
          this.toast.success('Lote excluído com sucesso!');
          this.carregarLotes();
        },
        error: (err) => {
          this.toast.error('Erro ao excluir lote.');
          console.error(err);
        }
      });
    }
  }

  onEditLote(lote: Lote): void {
    this.loteSelecionado = lote;
    this.modalAberto = true;
  }

  save(): void {
    this.loteFormComponent.submit();
  }
}
