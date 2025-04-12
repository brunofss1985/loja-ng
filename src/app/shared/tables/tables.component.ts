import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  getCellValue(row: any, header: string): string {
    const value = row?.[header];
    if (header === 'id' && typeof value === 'string') {
      return value.slice(-4);
    }
    return value ?? '';
  }

  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() tableName!: string;

  @Input() botaoCadastroAparecer: boolean = false;
  @Input() botaoCadastro!: string;

  @Input() mostrarBotoesAcao: boolean = false;
  @Input() botoesAcao!: string;

  @Output() botaoCadastroClick = new EventEmitter<void>();
  @Output() botaoDeleteClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onBotaoClick(): void {
    this.botaoCadastroClick.emit(); // Emite o evento para o componente pai
  }

onBotaoDeleteClick(){
  this.botaoDeleteClick.emit();
}

}
