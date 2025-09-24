export interface Produto {
  id?: number;
  nome: string;
  marca: string;
  slug?: string;
  descricao: string;
  descricaoCurta?: string;
  categorias?: string[];
  objetivos?: string[];
  peso: string;
  sabor?: string;
  preco: number;
  precoDesconto?: number;
  porcentagemDesconto?: string;
  tamanhoPorcao?: string;

  imagemMimeType?: string;
  imagemBase64?: string;
  galeriaMimeTypes?: string[];
  galeriaBase64?: string[];
  galeria?: string[];
  imagem?: string;

  ativo?: boolean;
  destaque?: boolean;
  disponibilidade?: 'em_estoque' | 'por_encomenda' | 'nao_disponivel';

  estoqueTotal?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;

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

  quantidadeVendida?: number;
  vendasMensais?: number[];
}
