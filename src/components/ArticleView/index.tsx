import React from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ArticleView.css";

import { ArticleViewProps } from "./ArticleView.type";
import { formataData } from "../../helpers/date";

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  autor,
  dataPublicacao,
  tempoLeitura,
}) => {
  const mdParser = new MarkdownIt();
  return (
    <>
      <header className="flex flex-row gap-3 items-center ml-20">
        <img
          src={autor.avatar}
          className="rounded-full"
          style={{ width: "50px", height: "50px" }}
        />
        <div className="block">
          <div>{autor.nome}</div>
          <div className="text-sm text-gray-500">
            {formataData(dataPublicacao)} · {tempoLeitura} de leitura
          </div>
        </div>
      </header>
      <MdEditor
        style={{ height: "100%" }}
        renderHTML={(text) => mdParser.render(text)}
        readOnly
        view={{ md: false, menu: false, html: true }}
        value={article}
      />
    </>
  );
};
