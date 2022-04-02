import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <>
      <Link to="/">HOME</Link>
      <Link to="/articles">MEUS ARTIGOS</Link>
      <Link to="/articles/new">NOVO ARTIGO</Link>
  );
};
