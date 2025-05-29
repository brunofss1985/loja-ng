import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  @Input() itemId!: number;
  @Output() deleteClicked = new EventEmitter<number>();

  onDeleteClick() {
    this.deleteClicked.emit(this.itemId);
  }
}
  
