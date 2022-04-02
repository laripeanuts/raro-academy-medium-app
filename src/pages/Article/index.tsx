import { useEffect, useState } from "react";
import { ArticleView } from "../../components/ArticleView";
import faker from "@faker-js/faker";

export const ArticlePage = () => {
  const [article, setArticle] = useState<string>("");
  const [autor] = useState({
    nome: faker.name.firstName(),
    avatar: faker.image.avatar(),
  });
  const [dataPublicacao] = useState(new Date());

  useEffect(() => {
    async function loadArticle() {
      // este article.md precisa ser adicionado, temporariamente ao nosso código. Podemos copiar este conteúdo dentro da nossa pasta /public.
      // sugiro que você retire este documento de `src/stories/assets/markdown/article.md`
      const response = await fetch("/article.md");
      const article = await response.text();
      setArticle(article);
    }

    loadArticle();
  }, []);

  return (
    <div className="m-10">
      <ArticleView
        article={article}
        autor={autor}
        dataPublicacao={dataPublicacao}
        tempoLeitura={"10min"}
      />
    </div>
  );
};