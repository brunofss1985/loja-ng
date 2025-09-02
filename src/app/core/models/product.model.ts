// src/app/core/models/product.model.ts

export interface Produto {
  id?: number;
  nome: string;
  marca: string;
  slug?: string;
  descricao: string;
  descricaoCurta?: string;
  categorias?: string[];
  objetivos?: string[]; // <<< NOVO CAMPO
  peso: string;
  sabor?: string;
  preco: number;
  precoDesconto?: number;
  porcentagemDesconto?: string;
  custo?: number;
  fornecedor?: string;
  lucroEstimado?: number;
  statusAprovacao?: string;
  tamanhoPorcao?: string;
  galeria?: string[];
  imagem?: string;
  imagemMimeType?: string;
  galeriaMimeTypes?: string[];
  ativo?: boolean;
  destaque?: boolean; // <<< NOVO CAMPO
  disponibilidade?: 'em_estoque' | 'por_encomenda' | 'nao_disponivel';
  estoque?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  localizacaoFisica?: string;
  codigoBarras?: string;
  dimensoes?: {
    altura: number | null;
    largura: number | null;
    profundidade: number | null;
  };
  restricoes?: string[];
  tabelaNutricional?: any;
  modoDeUso?: string;
  palavrasChave?: string[];
  avaliacoes?: {
    media: number | null;
    comentarios: string[];
  };
  dataCadastro?: string | Date;
  dataUltimaAtualizacao?: string | Date;
  dataValidade?: string | Date;
  fornecedorId?: number;
  cnpjFornecedor?: string;
  contatoFornecedor?: string;
  prazoEntregaFornecedor?: string;
  quantidadeVendida?: number;
  vendasMensais?: number[];
}