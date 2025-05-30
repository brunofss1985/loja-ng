import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Produto } from 'src/app/core/models/product.model';
import { ModalService } from 'src/app/core/services/modalService/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(private modalService: ModalService) {}

  @Output() saveClick = new EventEmitter<Produto>();

  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() isOpen = false;
  @Input() tittleModal = '';
  @Input() showRegisterForm = false;
  @Input() size!: 'small' | 'medium' | 'large' | 'xlarge';

  ngOnInit(): void {
    this.modalService.openModal$.subscribe(() => {
      this.isOpen = true;
    });
  }
    // Fechar o modal com a tecla ESC
    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKey(event: KeyboardEvent) {
      this.close();
    }

    save() {
      this.saveClick.emit();
    }

    close() {
      this.isOpen = false;
      this.isOpenChange.emit(false);
    }
}
