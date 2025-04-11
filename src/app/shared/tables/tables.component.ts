import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
