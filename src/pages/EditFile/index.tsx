import apiClient from '../../services/api-client'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArticleForm } from "../../components/ArticleForm";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";

export const EditFilePage = () => {
  const [artigo, setArtigo] = useState<ArticleThumbnailProps>();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      buscarArtigo();
    }
  }, [id]);

  async function buscarArtigo() {
    const token = localStorage.getItem("access_token");
    const response = await apiClient.get<ArticleThumbnailProps>(`/artigos/${id}`);
    setArtigo(response.data);
  }

 const handleSubmit = async (artigo: ArticleThumbnailProps) => {
    if (artigo.id) {
      await apiClient.patch(
        `/artigos/${artigo.id}`,
        {...artigo}
        )
      } else {
        await apiClient.post(
          `/artigos`,
          {...artigo}
      )
    }
  }

  return (
    <>
      <div className="items-center justify-center m-10">
        <ArticleForm
          article={artigo}
          onSubmit={ handleSubmit }
        />
      </div>
    </>
  );
};
