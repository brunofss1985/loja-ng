export interface Produto {
  id: number;
  nome: string;
  slug?: string;
  descricao: string;
  descricaoCurta?: string;
  categoria: string;
  peso: string;
  sabor?: string;
  preco: number;
  precoDesconto?: number;
  custo?: number;
  fornecedor?: string;
  lucroEstimado?: number;
  statusAprovacao?: string;
  tamanhoPorcao?: string;
  galeria?: string[]; // base64 ou nomes
  imagem?: string;
  imagemMimeType?: string;
  galeriaMimeTypes?: string[];

  // Novos campos
  ativo?: boolean;
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
  tabelaNutricional?: any; // ou defina melhor se quiser tipar os nutrientes
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
