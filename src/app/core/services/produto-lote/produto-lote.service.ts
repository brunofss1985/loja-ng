import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProdutoLote {
  produtoId: number;
  loteId: number;
  quantidade: number;
  codigoBarras?: string;
  custo?: number;
  valorVenda?: number;
  dataValidade?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoLoteService {
  private apiUrl = 'http://localhost:8080/api/produtos-lote';

  constructor(private http: HttpClient) {}

  criarProdutoLote(payload: ProdutoLote): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }

  // Você pode adicionar mais métodos aqui se quiser (buscar, listar, etc.)
}
