import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";

import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { Message } from "../../components/Message";

export const MyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);
  const [list, setList] = useState<ArticleThumbnailProps[]>([]);

  async function buscaMeusArtigos() {
    const token = localStorage.getItem("access_token");
    const response = await apiClient.get<ArticleThumbnailProps[]>(
      "/artigos/meus-artigos"
      );

    setArticles(response.data);
  }
    
  useEffect(() => {
    buscaMeusArtigos();
  }, []);

  if (articles.length === 0) {
    return (
      <Message
        title="Ainda não possui artigo... 😢"
        message="O que você acha de publicar seu primeiro artigo?"
        link="/articles/new"
        textLink="Vamos lá!"
      />
    );
  } else {
    return (
      <div className="my-30">
        <ArticleList articles={articles} />
      </div>
    );
  }
};
