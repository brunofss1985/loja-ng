import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ProdutoVendidoDTO {
  id: number;
  produtoId: number | null;
  orderId: number | null;
  produtoNome: string | null;
  customerNome: string | null;
  customerEmail: string | null;
  codigoBarras: string;
  loteCodigo: string | null;
  dataVenda: string;
  valorVenda: number;
}

@Injectable({ providedIn: 'root' })
export class VendasService {
  private apiUrl = `${environment.apiUrl}/api/vendas`;

  constructor(private http: HttpClient) {}

  finalizar(orderId: number, codigoBarras: string, loteCodigo: string): Observable<ProdutoVendidoDTO> {
    return this.http.post<ProdutoVendidoDTO>(`${this.apiUrl}/finalizar`, {
      orderId,
      codigoBarras,
      loteCodigo,
    });
  }

  listar(): Observable<ProdutoVendidoDTO[]> {
    return this.http.get<ProdutoVendidoDTO[]>(this.apiUrl);
  }
}
