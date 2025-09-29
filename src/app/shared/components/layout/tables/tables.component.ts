import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ModalService } from 'src/app/core/services/modalService/modal.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit, OnChanges {
  @Input() title!: string;
  @Input() columns: string[] = [];
  @Input() columnLabels: { [key: string]: string } = {};
  @Input() showCreateButton: boolean = false;
  @Input() createButtonLabel!: string;
  @Input() rows: any[] = [];
  @Input() showActionButtons: boolean = false;

  @Input() showEditButton: boolean = true;
  @Input() showViewButton: boolean = false;
  @Input() showDeleteButton: boolean = true;

  @Input() actionButtonsLabel!: string;
  @Input() cellFormatter?: (header: string, value: any) => string;

  @Input() clientSidePagination: boolean = true;
  @Input() sortableColumns: string[] = [];

  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalPages: number = 1;

  @Output() createButtonClicked = new EventEmitter<void>();
  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();
  @Output() viewRow = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  paginatedRows: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows'] || changes['pageSize'] || changes['currentPage']) {
      this.updatePagination();
    }
  }

  onCreateButtonClick(): void {
    this.createButtonClicked.emit();
  }

  onEditRow(row: any): void {
    this.editRow.emit(row);
  }

  onDeleteRow(id: any): void {
    this.deleteRow.emit(id);
  }

  onViewRow(row: any): void {
    this.viewRow.emit(row);
  }

  onSort(column: string): void {
    if (!this.clientSidePagination || !this.sortableColumns.includes(column)) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.rows.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  onChangePageSize(size: number): void {
    if (this.clientSidePagination) {
      this.pageSize = +size;
      this.currentPage = 0;
      this.updatePagination();
    } else {
      this.pageSizeChange.emit(+size);
    }
  }

  onChangePage(page: number): void {
    if (this.clientSidePagination) {
      this.currentPage = page;
      this.updatePagination();
    } else {
      this.pageChange.emit(page);
    }
  }

  updatePagination(): void {
    if (!this.clientSidePagination) {
      this.paginatedRows = this.rows;
      return;
    }

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRows = this.rows.slice(start, end);
    this.totalPages = Math.ceil(this.rows.length / this.pageSize);
  }

  getTotalPages(): number {
    return this.clientSidePagination
      ? Math.ceil(this.rows.length / this.pageSize)
      : this.totalPages;
  }

  getDisplayedPages(): number[] {
    const pages = [];
    const total = this.getTotalPages();

    const maxVisible = 6;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, this.currentPage - half);
    let end = start + maxVisible;

    if (end > total) {
      end = total;
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'status-created';
      case 'PAID':
        return 'status-paid';
      case 'CANCELED':
        return 'status-canceled';
      case 'PROCESSING':
        return 'status-processing';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      case 'PENDING':
        return 'status-pending';
      default:
        return 'status-created';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'Criado';
      case 'PAID':
        return 'Pago';
      case 'CANCELED':
        return 'Cancelado';
      case 'PROCESSING':
        return 'Processando';
      case 'SHIPPED':
        return 'Enviado';
      case 'DELIVERED':
        return 'Entregue';
      case 'PENDING':
        return 'Pendente';
      default:
        return status;
    }
  }
}
