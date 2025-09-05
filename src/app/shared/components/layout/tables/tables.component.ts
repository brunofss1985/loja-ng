import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/core/services/modalService/modal.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  @Input() title!: string;

  @Input() columns: string[] = [];
  @Input() columnLabels: { [key: string]: string } = {};

  @Input() showCreateButton: boolean = false;
  @Input() createButtonLabel!: string;

  @Input() rows: any[] = [];

  @Input() showActionButtons: boolean = false;
  @Input() actionButtonsLabel!: string;
  // 💡 Adicionado novo input para controlar a visibilidade do botão de edição
  @Input() showEditButton: boolean = true; 

  @Input() cellFormatter?: (header: string, value: any) => string;

  @Output() editRow = new EventEmitter<any>();

  @Output() createButtonClicked = new EventEmitter<void>();

  @Output() deleteRow = new EventEmitter<any>();

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  onCreateButtonClick(): void {
    this.createButtonClicked.emit();
  }

  openModal() {
    this.modalService.open();
  }

  onDeleteRow(id: any) {
    this.deleteRow.emit(id);
  }

  onEditRow(id: any) {
    this.editRow.emit(id);
  }
}