// package src/app/core/services/produtosService/produtos.service.ts;
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  buscarComFiltros(
    categorias: string[] | undefined,
    marcas: string[] | undefined,
    minPreco: number | undefined,
    maxPreco: number | undefined,
    page: number,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (minPreco !== undefined && minPreco !== null) {
      params = params.set('minPreco', minPreco.toString());
    }
    if (maxPreco !== undefined && maxPreco !== null) {
      params = params.set('maxPreco', maxPreco.toString());
    }

    // ✅ Envia como múltiplos parâmetros (categorias=A&categorias=B)
    if (categorias && categorias.length > 0) {
      categorias.forEach(categoria => {
        params = params.append('categorias', categoria);
      });
    }

    if (marcas && marcas.length > 0) {
      marcas.forEach(marca => {
        params = params.append('marcas', marca);
      });
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  buscarMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/marcas`);
  }

  buscarCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }

  // ✨ Busca marcas com base nas categorias selecionadas
  buscarMarcasPorCategorias(categorias: string[]): Observable<string[]> {
    let params = new HttpParams();
    if (categorias && categorias.length > 0) {
      categorias.forEach(c => {
        params = params.append('categorias', c);
      });
    }
    return this.http.get<string[]>(`${this.apiUrl}/marcas-por-categoria`, { params });
  }

  // ✨ Busca categorias com base nas marcas selecionadas
  buscarCategoriasPorMarcas(marcas: string[]): Observable<string[]> {
    let params = new HttpParams();
    if (marcas && marcas.length > 0) {
      marcas.forEach(m => {
        params = params.append('marcas', m);
      });
    }
    return this.http.get<string[]>(`${this.apiUrl}/categorias-por-marca`, { params });
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  salvarComImagem(formData: FormData): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  atualizarComImagem(id: number, formData: FormData): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }
}
