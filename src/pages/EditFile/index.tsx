import apiClient from '../../services/api-client'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleForm } from "../../components/ArticleForm";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { Button } from '../../components/Button';

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
    const token = localStorage.getItem("access_token");
    const response = await apiClient.get<ArticleThumbnailProps>(`/artigos/${id}`);
    setArtigo(response.data);
  };

  const handleSubmit = async (artigo: ArticleThumbnailProps) => {
    if (artigo.id) {
      await apiClient.patch(
        `/artigos/${artigo.id}`,
        { ...artigo }
      )
    } else {
      await apiClient.post(
        `/artigos`,
        { ...artigo }
        );
      };
    navigate(`/articles/my-articles`);
  };

  return (
    <>
      <div className="items-center justify-center m-10">
        <ArticleForm article={artigo} onSubmit={handleSubmit} />
      </div>
    </>
  );
};
