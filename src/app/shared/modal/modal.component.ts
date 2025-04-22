import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/auth/services/modalService/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(private modalService: ModalService) {}

  @Input() isOpen = false;
  @Input() tittleModal = '';
  @Input() showRegisterForm = false;

  close() {
    this.isOpen = false;
  }

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
}
