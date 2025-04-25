import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { DeleteService } from 'src/app/auth/services/deleteService/delete.service';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  @Input() itemId!: number;
  @Input() itemType: 'user' | 'product' = 'user';

  constructor(private deleteService: DeleteService) { }


  @Output() deleted = new EventEmitter<void>();

  delete() {
    if (this.itemType === 'user') {
      this.deleteService.deleteUser(this.itemId).subscribe({
        next: () => {
          this.deleted.emit();
          console.log(`Usuário ${this.itemId} deletado com sucesso`);
          // Aqui você pode emitir um evento para atualizar a tabela
        },
        error: (error) => {
          console.error('Erro ao deletar usuário:', error);
        }
      });
    } else if (this.itemType === 'product') {
      this.deleteService.deleteProduct(this.itemId).subscribe({
        next: () => {
          console.log(`Produto ${this.itemId} deletado com sucesso`);
          // Atualizar tabela aqui também, se for o caso
        },
        error: (error) => {
          console.error('Erro ao deletar produto:', error);
        }
      });
    }
  }
}
