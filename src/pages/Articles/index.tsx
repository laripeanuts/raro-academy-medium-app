/* src/pages/Artigos/index.tsx */
import { useEffect, useState } from "react";
import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
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

  return (
    isLoading ? <div></div> :
    <div className="my-30">
      <ArticleList articles={articles} />
    </div>
  );
};
