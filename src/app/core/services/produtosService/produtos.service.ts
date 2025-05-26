import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Produtos {
  id?: string;
  nome?: string;
  marca?: string;
  tipo?: string;
  categoria?: string;
  descricao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
private apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  getAllProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createProduto(produto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produto);
  }

  updateProduto(id: string, produto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produto);
  }

  deleteProduto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
