import axios from "axios";
import { useEffect, useState } from "react";

import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { geraArtigos } from "../../stories/helpers/gerador-artigos";

export const MyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);
  
  async function buscaMeusArtigos() {
    const response = await axios.get<ArticleThumbnailProps[]>(
      "http://3.221.159.196:3307/artigos/meus-artigos"
    );
    setArticles(response.data);
  }

  useEffect(() => {
    buscaMeusArtigos();
  }, []);

  useEffect(() => {
    setArticles(
      geraArtigos(5).map((article) => ({ ...article, editavel: true }))
    );
  }, []);

  return (
    <div className="my-30">
      <ArticleList articles={articles} />
    </div>
  );
};
