import React from "react";
import { ArticleThumbnail } from "../ArticleThumbnail";
import { Message } from "../Message";
import { ArticleListProps } from "./ArticleList.types";

export const ArticleList: React.FC<ArticleListProps> = ({
  articles
}) => {
  if (articles.length === 0) {
    return (
      <Message
        title="Ainda não tem artigo... 😢"
        message="O que você acha de publicar seu primeiro artigo?"
        link="/articles/new"
        textLink="Vamos lá!"
      />
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center m-10">
        {
          (articles.map(article => (
            <ArticleThumbnail
              key={article.titulo}
              {...article}
            />
          ))).reverse()
        }
      </div>
    );
  };
};