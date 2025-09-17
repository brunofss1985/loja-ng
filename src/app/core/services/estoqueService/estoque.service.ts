import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MovimentacaoEstoque {
  id?: number;
  produtoId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  dataMovimentacao?: string;
  lote?: string;
  observacao?: string;
}

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly apiUrl = `${environment.apiUrl}/api/estoque`;

  constructor(private http: HttpClient) {}

  buscarPorLote(lote: string): Observable<MovimentacaoEstoque[]> {
    const params = new HttpParams().set('lote', lote);
    return this.http.get<MovimentacaoEstoque[]>(`${this.apiUrl}/movimentacoes-por-lote`, { params });
  }

  listarProdutosComValidadeProxima(dias: number = 30): Observable<any[]> {
    const params = new HttpParams().set('dias', dias.toString());

    // Adiciona headers vazios para forçar passagem pelo Interceptor
    const headers = new HttpHeaders();

    return this.http.get<any[]>(`${this.apiUrl}/validade-proxima`, {
      params,
      headers
    });
  }

  registrarMovimentacao(mov: MovimentacaoEstoque): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, mov);
  }
}
