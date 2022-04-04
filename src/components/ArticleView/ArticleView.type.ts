export type ArticleViewProps = {
  article: string;
  autor: {
    nome: string;
    avatar: string;
  };
  dataPublicacao: Date;
  tempoLeitura?: string;
}