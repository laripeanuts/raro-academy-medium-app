import { useEffect, useState } from "react";
import { ArticleThumbnailProps } from "../ArticleThumbnail/ArticleThumbnail.types";
import { Button } from "../Button";
import { Input } from "../Input";
import { RitchTextEditor } from "../RitchTextEditor";

type ArticleFormProps = {
  article?: ArticleThumbnailProps;
  onClick?: () => void;
  onSubmit?: (article: ArticleThumbnailProps) => void;
};

export const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onSubmit,
  onClick,
}) => {
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagem, setImagem] = useState("");
  const [conteudo, setConteudo] = useState("");

  useEffect(() => {
    if (article) {
      setTitulo(article.titulo);
      setResumo(article.resumo);
      setImagem(article.imagem);
      setConteudo(article.conteudo || "");
    }
  }, [article]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      const articleToSubmit = {
        ...article,
        titulo,
        resumo,
        imagem,
        conteudo,
      };
      onSubmit(articleToSubmit as ArticleThumbnailProps);
    }
  };

  const transformaImagemEmBase64 = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      setImagem(event.target.result);
    };
  };

  return (
    <div className="grid min-h-screen mx-10 ">
      <div>
        <h1 className="text-xl font-semibold">
          Oi 👋,&nbsp;
          <span className="font-normal">
            faça sua contribuição, preencha e nos surpreenda!
          </span>
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <Input
            placeholder="Digite aqui o título"
            type="text"
            name="titulo"
            label="Titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <Input
            placeholder="Breve resumo do artigo"
            type="textarea"
            name="resumo"
            label="Resumo"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            required
          />

          <Input
            placeholder="Breve resumo do artigo"
            type="file"
            name="image"
            label="Banner"
            onChange={transformaImagemEmBase64}
            required={imagem === "" ? true : false}
          />

          <RitchTextEditor
            label="Conteúdo"
            name="conteudo"
            value={conteudo}
            onChange={setConteudo}
          />

          <div className="items-center justify-center flex-row">
            <Button
              type="submit"
              className="w-full mt-6 tracking-widest border-b-blue-600 bg-blue-500 py-3 text-white font-bold hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400"
            >
              Salvar
            </Button>
            {article && (
              <Button
                type="button"
                onClick={onClick}
                className="w-full mt-6 tracking-widest border-b-red-600 bg-red-500 py-3 text-white font-bold
        hover:bg-red-400 active:translate-y-[0.125rem] active:border-b-red-400"
              >
                Deletar
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
