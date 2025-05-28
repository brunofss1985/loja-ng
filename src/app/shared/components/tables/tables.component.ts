import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modalService/modal.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  @Input() headerLabels: { [key: string]: string } = {};

  @Input() headers: string[] = [];

  @Input() data: any[] = [];
  @Input() tableName!: string;

  @Input() botaoCadastroAparecer: boolean = false;
  @Input() botaoCadastro!: string;

  @Input() mostrarBotoesAcao: boolean = false;
  @Input() botoesAcao!: string;

  @Input() formatCell?: (header: string, value: any) => string;

  @Output() editUser = new EventEmitter<any>();

  @Output() botaoCadastroClick = new EventEmitter<void>();
  @Output() botaoDeleteClick = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  onBotaoClick(): void {
    this.botaoCadastroClick.emit(); // Emite o evento para o componente pai
  }

  onBotaoDeleteClick() {
    this.botaoDeleteClick.emit();
  }

  abrirModal() {
    this.modalService.open();
  }

  onDeleted() {
    this.deleted.emit(); // Dispara o evento para o componente pai
  }

  onEdit(user: any) {
    this.editUser.emit(user);
  }
}
