// src/app/core/services/produtosService/produtos.service.ts

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../../models/product.model';

// Interface para a contagem de itens
export interface CountedItem {
  name: string;
  count: number;
}

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
    size: number = 10,
    ordenacao: string | undefined = undefined // ✨ NOVO PARÂMETRO
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

    if (categorias && categorias.length > 0) {
      categorias.forEach((categoria) => {
        params = params.append('categorias', categoria);
      });
    }

    if (marcas && marcas.length > 0) {
      marcas.forEach((marca) => {
        params = params.append('marcas', marca);
      });
    } // ✨ ADICIONA O PARÂMETRO DE ORDENAÇÃO

    if (ordenacao) {
      params = params.set('sort', ordenacao);
    }

    return this.http.get<any>(this.apiUrl, { params });
  } // Métodos para listar itens com contagem

  buscarMarcas(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/marcas`);
  }

  buscarCategorias(): Observable<CountedItem[]> {
    return this.http.get<CountedItem[]>(`${this.apiUrl}/categorias`);
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
  } // Novos métodos para a contagem total

  buscarTotalMarcas(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/marcas/count`);
  }

  buscarTotalCategorias(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/categorias/count`);
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