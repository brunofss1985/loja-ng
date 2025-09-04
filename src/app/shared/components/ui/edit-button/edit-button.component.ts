import { Component,   OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modalService/modal.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent implements OnInit {

  constructor( public modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  openModal(){
    this.modalService.open()
  }
}
