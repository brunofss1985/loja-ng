export interface Produto {
  id: number;
  nome: string;
  slug?: string;
  descricao: string;
  descricaoCurta?: string;
  categoria: string;
  tags: string[];
  peso: string;
  sabor?: string;
  tamanhoPorcao?: string;
  ingredientes: string[];
  tabelaNutricional?: { [chave: string]: string | number };
  preco: number;
  precoDesconto?: number;
  estoque: number;
  qtdMinimaEstoque?: number;
  custo?: number;
  fornecedor?: string;
  lucroEstimado?: number; // Pode ser calculado no frontend
  sku?: string;
  codigoBarras?: string;
  imagemUrl: string;
  destaque?: boolean;
  novoLancamento?: boolean;
  maisVendido?: boolean;
  promocaoAtiva?: boolean;
  dataExpiracao?: Date;
  ultimaCompra?: Date;
  quantidadeVendida?: number;
  comentariosAdmin?: string[];
  statusAprovacao?: 'aprovado' | 'pendente' | 'rejeitado';
  publicado?: boolean;
  avaliacaoMedia?: number;
  quantidadeAvaliacoes?: number;
  criadoEm: Date;
  atualizadoEm: Date;
  ativo: boolean;
    // ✅ NOVOS CAMPOS binários
  imagem?: Uint8Array; // ou ArrayBuffer, dependendo do Angular HTTPClient
  imagemMimeType?: string;

  galeria?: Uint8Array[];
  galeriaMimeTypes?: string[];


}
