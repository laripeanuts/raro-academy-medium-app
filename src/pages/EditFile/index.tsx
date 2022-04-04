import apiClient from '../../services/api-client'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleForm } from "../../components/ArticleForm";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";

export const EditFilePage = () => {
  const [artigo, setArtigo] = useState<ArticleThumbnailProps>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      buscarArtigo();
    }
  }, [id]);

  async function buscarArtigo() {
    const response = await apiClient.get<ArticleThumbnailProps>(
      `/artigos/${id}`
    );
    setArtigo(response.data);
  }

  const handleSubmit = async (artigo: ArticleThumbnailProps) => {
    if (artigo.id) {
      await apiClient.patch(`/artigos/${artigo.id}`, { ...artigo });
      navigate(`/article/${artigo.id}`);
    } else {
      const newArticle = await apiClient.post(`/artigos`, { ...artigo }
      );
      navigate(`/article/${newArticle.data.id}`);
    }
  };

  async function handleOnClick() {
    await apiClient.delete(`/artigos/${id}`);
    navigate(`/my-articles`);
  };

  return (
    <>
      <div className="items-center justify-center m-10">
        <ArticleForm article={artigo} onSubmit={handleSubmit} onClick={handleOnClick} />
      </div>
    </>
  );
};
