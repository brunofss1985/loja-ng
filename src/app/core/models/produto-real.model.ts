export interface ProdutoReal {
  id?: number;
  loteId: number;
  produtoId: number;
  codigoBarras: string;
  quantidade: number;
  validade?: string;
  localizacao?: string;
}
 