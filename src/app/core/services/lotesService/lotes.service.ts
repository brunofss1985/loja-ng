import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Lote {
  id?: number;
  codigo: string;
  produtoId: number;
  dataValidade: string;
  fornecedor: string;
  contatoVendedor: string;
  custoPorUnidade: number;
  valorVendaSugerido: number;
  notaFiscalEntrada: string;
  localArmazenamento: string;
  statusLote: 'ativo' | 'inativo' | 'em_transito';
  dataRecebimento: string;
  quantidadeTotal?: number;

  // 🔽 Novos campos
  custoTotal?: number;
  lucroTotalEstimado?: number;
  lucroEstimadoPorUnidade?: number;
  codigoBarras?: string;
  cnpjFornecedor?: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
}

@Injectable({ providedIn: 'root' })
export class LotesService {
  private readonly apiUrl = `${environment.apiUrl}/api/lotes`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`);
  }

  listar(): Observable<Lote[]> {
    return this.http.get<Lote[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  buscarPorId(id: number): Observable<Lote> {
    return this.http.get<Lote>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  criar(lote: Lote): Observable<Lote> {
    return this.http.post<Lote>(this.apiUrl, lote, {
      headers: this.getAuthHeaders(),
    });
  }

  atualizar(id: number, lote: Lote): Observable<Lote> {
    return this.http.put<Lote>(`${this.apiUrl}/${id}`, lote, {
      headers: this.getAuthHeaders(),
    });
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
