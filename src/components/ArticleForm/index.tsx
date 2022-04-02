import { Button } from "../Button";
import { Input } from "../Input";
import { RitchTextEditor } from "../RitchTextEditor";

export const ArticleForm = () => {
  return (
    <div className="grid min-h-screen mx-10 ">
      <div>
        <h1 className="text-xl font-semibold">
          Olá👋,&nbsp;
          <span className="font-normal">por favor complete para continuar</span>
        </h1>
        <form className="mt-6">
          <Input
            placeholder="Digite aqui o título"
            type="text"
            name="titulo"
            label="Titulo"
            required
          />
          <Input
            placeholder="Breve rewsumo do artigo"
            type="textarea"
            name="resumo"
            label="Resumo"
            required
          />

          <Input
            placeholder="Breve rewsumo do artigo"
            type="file"
            name="image"
            label="Banner"
            required
          />

          <RitchTextEditor
            label="Conteúdo"
            name="conteudo"
          />

          <Button type="submit">Salvar</Button>
        </form>
      </div>
    </div>
  );
};