import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";

import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";

export const MyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);

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
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
          <div>
            <h2 className="text-gray-800 text-center text-3xl font-semibold">
              Sem artigos... 🙁
            </h2>
            <p className="mt-2 text-gray-600">
              O que você acha de publicar seu primeiro artigo?
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <a
              className="text-xl font-medium text-indigo-500"
              href="/articles/new"
            >
              Vamos lá!
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="my-30">
        <ArticleList articles={articles} />
      </div>
    );
  }
};
