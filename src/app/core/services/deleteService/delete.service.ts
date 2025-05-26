import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  constructor(private http: HttpClient) {}

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`/api/user/${id}`);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`/api/products/${id}`);
  }

}
