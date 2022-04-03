import { useEffect, useState } from "react";
import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { Message } from "../../components/Message";
import apiClient from "../../services/api-client";

export const ArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);
  const [isLoading, SetIsLoading] = useState(true);

  async function buscaArtigos() {
    const response = await apiClient.get<ArticleThumbnailProps[]>(
      `/artigos`
    );
    setArticles(response.data);
    SetIsLoading(false);
  }
  useEffect(() => {
    buscaArtigos();
  }, []);

  return isLoading ? (
    <div>
      <Message
        title="Carregando artigos... 😊"
        message="O que você acha de publicar um artigo?"
        link="/articles/new"
        textLink="Vamos lá!"
      />
    </div>
  ) : (
    <div className="my-30">
      <ArticleList articles={articles} />
    </div>
  );
};
