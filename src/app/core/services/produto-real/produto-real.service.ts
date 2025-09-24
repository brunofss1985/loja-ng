import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdutoReal } from '../../models/produto-real.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoRealService {
  private apiUrl = 'http://localhost:8080/api/produto-real';

  constructor(private http: HttpClient) {}

  cadastrar(produto: ProdutoReal): Observable<ProdutoReal> {
    return this.http.post<ProdutoReal>(this.apiUrl, produto);
  }

  listarPorLote(loteId: number): Observable<ProdutoReal[]> {
    return this.http.get<ProdutoReal[]>(`${this.apiUrl}/lote/${loteId}`);
  }
   obterEstoqueTotalPorProdutoId(produtoId: number): Observable<{ estoqueTotal: number }> {
    return this.http.get<{ estoqueTotal: number }>(
      `${this.apiUrl}/estoque-total/${produtoId}`
    );
  }
}
