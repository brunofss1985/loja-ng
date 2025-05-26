import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

    private openModalSource = new Subject<void>();
    openModal$ = this.openModalSource.asObservable();
  
    open() {
      this.openModalSource.next();
    }
  }