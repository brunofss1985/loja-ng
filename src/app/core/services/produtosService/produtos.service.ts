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

  // Novo método que centraliza a busca com todos os filtros
  buscarComFiltros(categoria: string | undefined, marcas: string[], minPreco: number, maxPreco: number, page: number, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('minPreco', minPreco.toString())
      .set('maxPreco', maxPreco.toString());

    if (categoria && categoria !== 'todos') {
      params = params.set('categoria', categoria);
    }
    
    if (marcas && marcas.length > 0) {
      marcas.forEach(marca => {
        params = params.append('marcas', marca);
      });
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
  
  // Novo método para buscar as marcas disponíveis para o filtro
  buscarMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/marcas`);
  }

  // Os métodos antigos de paginação foram removidos para evitar redundância e centralizar a lógica no novo método.

  // ----------------------------
  // Produtos sem imagem (puro JSON)
  // ----------------------------
  
  // Os métodos abaixo não precisam de alteração, mas foram mantidos para completar o arquivo
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

  // ----------------------------
  // Produtos com imagem (FormData)
  // ----------------------------

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