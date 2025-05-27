import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DeleteService } from 'src/app/core/services/deleteService/delete.service';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  @Input() itemId!: number;
  @Input() itemType: 'user' | 'product' = 'user';

  constructor(private deleteService: DeleteService, private toastr: ToastrService) { }

  @Output() deleted = new EventEmitter<void>();

  delete() {
    const confirmar = confirm('Tem certeza que deseja deletar este item?');
    if (!confirmar) return;

    if (this.itemType === 'user') {
      this.deleteService.deleteUser(this.itemId).subscribe({
        next: () => {
          this.toastr.success(`Usuário ${this.itemId} deletado com sucesso`);
          this.deleted.emit();
        },
        error: (error) => {
          this.toastr.error('Erro ao deletar usuário');
          console.error('Erro ao deletar usuário:', error);
        }
      });
    } else if (this.itemType === 'product') {
      this.deleteService.deleteProduct(this.itemId).subscribe({
        next: () => {
          this.toastr.success(`Produto ${this.itemId} deletado com sucesso`);
          this.deleted.emit();
        },
        error: (error) => {
          this.toastr.error('Erro ao deletar produto');
          console.error('Erro ao deletar produto:', error);
        }
      });
    }
  }
}
  
