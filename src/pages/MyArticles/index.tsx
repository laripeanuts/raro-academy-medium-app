
import { useEffect, useState } from "react";
 import apiClient from "../../services/api-client";

import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { geraArtigos } from "../../stories/helpers/gerador-artigos";

export const MyArticlesPage = () => {

  async function buscaMeusArtigos() {
    const token = localStorage.getItem("access_token");

    const response = await apiClient.get<ArticleThumbnailProps[]>(
      "/articles/my-articles"
    );

    setArticles(response.data);
  }

  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);

  useEffect(() => {
    setArticles(
      geraArtigos(5).map((artigo) => ({ ...artigo, editavel: true }))
    );
  }, []);

  return (
    <div className="my-30">
      <ArticleList articles={articles} />
    </div>
  );
};