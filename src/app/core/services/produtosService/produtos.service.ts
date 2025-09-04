// src/app/core/services/produtosService/produtos.service.ts

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produto } from '../../models/product.model';
import { environment } from 'src/environments/environment';

// Interface para a resposta paginada
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
  numberOfElements: number;
}

// Interface para a contagem de itens
export interface CountedItem {
  name: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private readonly apiUrl = `${environment.apiUrl}/api/produtos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Busca por termo (paginação)
  buscarPorTermo(
    termo: string,
    page: number,
    size: number = 10,
    sort: string = 'relevance'
  ): Observable<PaginatedResponse<Produto>> {
    let params = new HttpParams()
      .set('termo', termo)
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PaginatedResponse<Produto>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  // Busca com filtros
  buscarComFiltros(
    categorias?: string[],
    marcas?: string[],
    objetivos?: string[],
    minPreco: number = 0,
    maxPreco: number = 999999,
    page: number = 0,
    size: number = 10,
    sort: string = 'relevance'
  ): Observable<PaginatedResponse<Produto>> {
    let params = new HttpParams()
      .set('minPreco', minPreco.toString())
      .set('maxPreco', maxPreco.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (categorias && categorias.length > 0) {
      categorias.forEach((categoria) => {
        params = params.append('categorias', categoria);
      });
    }
    if (marcas && marcas.length > 0) {
      marcas.forEach((marca) => {
        params = params.append('marcas', marca);
      });
    }
    if (objetivos && objetivos.length > 0) {
      objetivos.forEach((objetivo) => {
        params = params.append('objetivos', objetivo);
      });
    }

    return this.http.get<PaginatedResponse<Produto>>(this.apiUrl, { params });
  }

  // ✅ Ajustado para retornar PaginatedResponse<Produto>
  buscarProdutosEmDestaque(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<Produto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Produto>>(
      `${this.apiUrl}/destaques`,
      { params }
    );
  }

  // Lista objetivos com contagem
  buscarObjetivos(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/objetivos`).pipe(
      map((items) =>
        items.map((item) => ({ name: item.name, count: item.count }))
      )
    );
  }

  // Lista marcas com contagem
  buscarMarcas(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/marcas`).pipe(
      map((items) =>
        items.map((item) => ({ name: item.name, count: item.count }))
      )
    );
  }

  // Lista categorias com contagem
  buscarCategorias(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/categorias`).pipe(
      map((items) =>
        items.map((item) => ({ name: item.name, count: item.count }))
      )
    );
  }

  // Marcas disponíveis para as categorias informadas
  buscarMarcasPorCategorias(categorias: string[]): Observable<CountedItem[]> {
    let params = new HttpParams();
    if (categorias && categorias.length > 0) {
      categorias.forEach((c) => {
        params = params.append('categorias', c);
      });
    }
    return this.http.get<CountedItem[]>(`${this.apiUrl}/marcas-por-categoria`, {
      params,
    });
  }

  // Categorias disponíveis para as marcas informadas
  buscarCategoriasPorMarcas(marcas: string[]): Observable<CountedItem[]> {
    let params = new HttpParams();
    if (marcas && marcas.length > 0) {
      marcas.forEach((m) => {
        params = params.append('marcas', m);
      });
    }
    return this.http.get<CountedItem[]>(`${this.apiUrl}/categorias-por-marca`, {
      params,
    });
  }

  // Objetivos disponíveis para as categorias informadas
  buscarObjetivosPorCategorias(categorias: string[]): Observable<CountedItem[]> {
    let params = new HttpParams();
    if (categorias && categorias.length > 0) {
      categorias.forEach((c) => {
        params = params.append('categorias', c);
      });
    }
    return this.http.get<CountedItem[]>(
      `${this.apiUrl}/objetivos-por-categoria`,
      {
        params,
      }
    );
  }

  // Totais (contagens globais)
  buscarTotalMarcas(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/marcas/count`);
  }

  buscarTotalCategorias(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/categorias/count`);
  }

  buscarTotalObjetivos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/objetivos/count`);
  }

  // CRUD básico
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
