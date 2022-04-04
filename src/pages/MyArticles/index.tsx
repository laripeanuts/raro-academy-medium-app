import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { Message } from "../../components/Message";

export const MyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);
  const [isLoading, SetIsLoading] = useState(true);

  async function buscaMeusArtigos() {
    const response = await apiClient.get<ArticleThumbnailProps[]>(
      "/artigos/meus-artigos"
    );

    setArticles(response.data);
    SetIsLoading(false);
  }
    
  useEffect(() => {
    buscaMeusArtigos();
  }, []);

   return isLoading ? (
    <div>
      <Message
        title="Carregando artigos... 😊"
        message="Paciência padawan"
      />
    </div>
  ) : (
      <div className="my-30">
        <ArticleList articles={articles} />
      </div>
    );

};