import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  private apiUrl = `${environment.apiUrl}/api/produtos-lote`;

  constructor(private http: HttpClient) {}

  criarProdutoLote(payload: ProdutoLote): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }

  // Você pode adicionar mais métodos aqui se quiser (buscar, listar, etc.)
}
