import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produto } from '../../models/product.model';

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
  private readonly apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // ✨ NOVO MÉTODO: Busca produtos por termo
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

  // ✅ MÉTODO ATUALIZADO: Busca com filtros, incluindo "objetivos"
  buscarComFiltros(
    categorias?: string[],
    marcas?: string[],
    objetivos?: string[], // NOVO PARÂMETRO
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
    // NOVO: Adiciona os objetivos aos parâmetros da URL
    if (objetivos && objetivos.length > 0) {
      objetivos.forEach((objetivo) => {
        params = params.append('objetivos', objetivo);
      });
    }

    return this.http.get<PaginatedResponse<Produto>>(this.apiUrl, { params });
  }

  // ✅ NOVO MÉTODO: Lista objetivos com contagem
  buscarObjetivos(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/objetivos`).pipe(
      map((items) =>
        items.map((item) => ({ name: item.name, count: item.count }))
      )
    );
  }

  // Métodos para listar itens com contagem
  buscarMarcas(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/marcas`).pipe(
      map((items) =>
        items.map((item) => ({ name: item.name, count: item.count }))
      )
    );
  }

  buscarCategorias(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/categorias`).pipe(
      map((items) =>
        items.map((item) => ({ name: item.name, count: item.count }))
      )
    );
  }

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

  // ✅ NOVO MÉTODO: Buscar objetivos por categoria
  buscarObjetivosPorCategorias(categorias: string[]): Observable<CountedItem[]> {
    let params = new HttpParams();
    if (categorias && categorias.length > 0) {
      categorias.forEach((c) => {
        params = params.append('categorias', c);
      });
    }
    return this.http.get<CountedItem[]>(`${this.apiUrl}/objetivos-por-categoria`, {
      params,
    });
  }

  // Novos métodos para a contagem total
  buscarTotalMarcas(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/marcas/count`);
  }

  buscarTotalCategorias(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/categorias/count`);
  }

  // ✅ NOVO MÉTODO: Contagem total de objetivos
  buscarTotalObjetivos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/objetivos/count`);
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