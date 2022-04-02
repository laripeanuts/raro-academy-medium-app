/* src/pages/Artigos/index.tsx */
import { useEffect, useState } from "react";
import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { geraArtigos } from "../../stories/helpers/gerador-artigos";

export const ArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);

  useEffect(() => {
    setArticles(geraArtigos(10));
  }, []);

  return (
    <div className="my-30">
      <ArticleList articles={articles} />
    </div>
  );
};
