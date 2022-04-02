import { useEffect, useState } from "react";

import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { geraArtigos } from "../../stories/helpers/gerador-artigos";

export const MyArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);

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
