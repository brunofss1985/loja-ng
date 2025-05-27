import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modalService/modal.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
getCellValue(row: any, header: string): string {
  const value = row?.[header];
  if (header === 'id' && typeof value === 'string') {
    return value.slice(-4);
  }
  if (header === 'userType') {
    return value === 'ADMIN' ? 'Administrador' : 'Usuário';
  }
  return value ?? '';
}


  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() tableName!: string;

  @Input() botaoCadastroAparecer: boolean = false;
  @Input() botaoCadastro!: string;

  @Output() editUser = new EventEmitter<any>();

  @Input() mostrarBotoesAcao: boolean = false;
  @Input() botoesAcao!: string;

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
