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

export interface TableFilterOption {
  label: string;
  value: any;
}

export type TableFilterType = 'text' | 'select';

export interface TableFilterConfig {
  key: string; // coluna/campo no row
  type: TableFilterType; // tipo de filtro
  placeholder?: string; // placeholder do input/select
  options?: TableFilterOption[]; // para selects
  // Predicado customizado: se fornecido, substitui a lógica padrão desse filtro
  predicate?: (cellValue: any, filterValue: any, row?: any) => boolean;
}

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
  // Exibe linha de filtros por coluna
  @Input() showFilters: boolean = true;
  // Configuração de filtros (personalizável); se ausente, usa todas as colunas como texto
  @Input() filtersConfig?: TableFilterConfig[];
  // Exibe contador de itens no título
  @Input() showCount: boolean = false;
  // Exibe contador na linha da paginação (à esquerda)
  @Input() showFooterCount: boolean = true;

  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalPages: number = 1;
  // Debounce configurável para filtros (ms)
  @Input() filterDebounceMs: number = 200;

  @Output() createButtonClicked = new EventEmitter<void>();
  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();
  @Output() viewRow = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  // Em modo server-side, permite emitir as mudanças de filtro
  @Output() filtersChange = new EventEmitter<{ [key: string]: string }>();

  paginatedRows: any[] = [];
  filteredRows: any[] = [];
  filterValues: { [key: string]: any } = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  renderFilters: TableFilterConfig[] = [];
  private filterDebounce: any;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.ensureFilterKeys();
    this.renderFilters = this.computeRenderFilters();
    this.filteredRows = [...this.rows];
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      // Reaplica filtros ao mudar as linhas
      this.applyFilters();
    }
    if (changes['columns'] || changes['filtersConfig']) {
      this.ensureFilterKeys();
      this.renderFilters = this.computeRenderFilters();
    }
    if (changes['pageSize'] || changes['currentPage']) {
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
      // Em modo server, não alteramos dados; filtragem fica externa
      this.paginatedRows = this.rows;
      return;
    }

    const base = this.getSortedRows();
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRows = base.slice(start, end);
    this.totalPages = Math.ceil(this.filteredRows.length / this.pageSize) || 1;
  }

  getTotalPages(): number {
    return this.clientSidePagination
      ? Math.ceil(this.filteredRows.length / this.pageSize) || 1
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

  // Índices de exibição atuais (para a barra de status)
  get pageStartIndex(): number {
    if (!this.clientSidePagination) {
      return this.currentPage * this.pageSize;
    }
    return this.currentPage * this.pageSize;
  }

  get pageEndIndex(): number {
    if (!this.clientSidePagination) {
      // Melhor esforço: quantidade disponível na página atual
      return this.pageStartIndex + this.paginatedRows.length;
    }
    return Math.min(this.filteredRows.length, this.pageStartIndex + this.paginatedRows.length);
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CREATED':
        return 'status-created';
      case 'PAID':
        return 'status-paid';
      case 'CANCELED':
        return 'status-canceled';
      case 'DESPACHADO':
        return 'status-despachado';
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
      case 'DESPACHADO':
        return 'Despachado';
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

  // Filtros
  onFilterChange(column: string, value: string): void {
    this.filterValues[column] = value;
    if (this.clientSidePagination) {
      this.currentPage = 0;
      if (this.filterDebounce) {
        clearTimeout(this.filterDebounce);
      }
      this.filterDebounce = setTimeout(() => {
        this.applyFilters();
      }, this.filterDebounceMs);
    } else {
      if (this.filterDebounce) {
        clearTimeout(this.filterDebounce);
      }
      this.filterDebounce = setTimeout(() => {
        this.filtersChange.emit({ ...this.filterValues });
      }, this.filterDebounceMs);
    }
  }

  private ensureFilterKeys(): void {
    const keys = this.getFilterKeys();
    for (const key of keys) {
      if (this.filterValues[key] === undefined) {
        this.filterValues[key] = '';
      }
    }
  }

  private applyFilters(): void {
    this.ensureFilterKeys();
    const filters = this.getActiveFilters();

    if (filters.length === 0) {
      this.filteredRows = [...this.rows];
    } else {
      this.filteredRows = this.rows.filter((row) => {
        return filters.every((f) => this.matchesFilter(row, f.key, f.value));
      });
    }
    this.updatePagination();
  }

  private getSortedRows(): any[] {
    const base = [...this.filteredRows];
    if (!this.sortColumn) return base;
    const column = this.sortColumn;
    const dir = this.sortDirection;

    return base.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (valA == null && valB == null) return 0;
      if (valA == null) return dir === 'asc' ? -1 : 1;
      if (valB == null) return dir === 'asc' ? 1 : -1;

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Helpers para filtros configuráveis
  private getFilterKeys(): string[] {
    if (this.filtersConfig && this.filtersConfig.length > 0) {
      return this.filtersConfig.map((f) => f.key);
    }
    return this.columns || [];
  }

  private computeRenderFilters(): TableFilterConfig[] {
    if (this.filtersConfig && this.filtersConfig.length > 0) {
      return this.filtersConfig.slice();
    }
    // Fallback: todas as colunas são filtros de texto
    return (this.columns || []).map((c) => ({
      key: c,
      type: 'text',
      placeholder: `Filtrar ${this.columnLabels[c] || c}`,
    }));
  }

  trackByFilter(index: number, f: TableFilterConfig) {
    return f.key || index;
  }

  private getFilterConfig(key: string): TableFilterConfig | undefined {
    return this.filtersConfig?.find((f) => f.key === key);
  }

  private getActiveFilters(): Array<{ key: string; value: any }> {
    const keys = this.getFilterKeys();
    const pairs: Array<{ key: string; value: any }> = [];
    for (const k of keys) {
      const v = this.filterValues[k];
      if (v !== undefined && v !== null && String(v).toString().trim() !== '') {
        pairs.push({ key: k, value: v });
      }
    }
    return pairs;
  }

  private matchesFilter(row: any, key: string, value: any): boolean {
    const cfg = this.getFilterConfig(key);
    const cell = row ? row[key] : undefined;

    if (cfg?.predicate) {
      try {
        return cfg.predicate(cell, value, row);
      } catch {
        return true; // Em caso de erro no predicado, não bloquear
      }
    }

    const v = value;
    if (cfg?.type === 'select') {
      if (v === '' || v === null || v === undefined) return true;
      return String(cell) === String(v);
    }
    // padrão: texto (contains case-insensitive)
    const cellStr = (cell === null || cell === undefined) ? '' : String(cell);
    return cellStr.toLowerCase().includes(String(v).toLowerCase());
  }

  // UI helpers
  get hasActiveFilters(): boolean {
    return this.getActiveFilters().length > 0;
  }

  clearFilters(): void {
    const keys = this.getFilterKeys();
    for (const k of keys) {
      this.filterValues[k] = '';
    }
    this.currentPage = 0;
    if (this.clientSidePagination) {
      this.applyFilters();
    } else {
      this.filtersChange.emit({ ...this.filterValues });
    }
  }
}
