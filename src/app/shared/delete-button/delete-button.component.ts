import { Component, Input } from '@angular/core';
import { DeleteService } from 'src/app/auth/services/deleteService/delete.service';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.css']
})
export class DeleteButtonComponent {
  @Input() itemId!: number;
  @Input() itemType: 'user' | 'product' = 'user'; // ou use enum depois, se preferir

  constructor(private deleteService: DeleteService) {}

  delete() {
    if (!this.itemId) return;

    const confirmed = confirm('Tem certeza que deseja excluir?');
    if (!confirmed) return;

    if (this.itemType === 'user') {
      this.deleteService.deleteUser(this.itemId).subscribe(() => {
        alert('Usuário excluído com sucesso!');
      });
    } else if (this.itemType === 'product') {
      this.deleteService.deleteProduct(this.itemId).subscribe(() => {
        alert('Produto excluído com sucesso!');
      });
    }
  }
}
