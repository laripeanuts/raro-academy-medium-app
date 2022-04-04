import apiClient from "../../services/api-client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { Input } from "../Input";

export const CreateUser = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  async function newUser (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setLoading(true);

    try {
      const url = "/usuarios";
      const response = await apiClient.post(url, { nome, login, senha });
      
      if (nome !== null && login !== null && senha !== null) {
        navigate("/login");
      }
    } catch (error: any) {
      setErro("Erro ao criar usuário. Tente novamente mais tarde.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/">
            <img
              className="mx-auto h-12 w-auto"
              src="https://rarolabs.com.br/assets/logo-cae9beb1976500005b5e29dea19bdaa2761082232703a16beb71ffd2117014e5.png"
              alt="Workflow"
            />
          </Link>
        </div>
        <form className="mt-8 space-y-6" onSubmit={newUser}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mt-5">
              <Input
                type="text"
                name="name"
                label="nome"
                placeholder="nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
          </div>
            <div className="mt-5">
              <Input
                type="text"
                name="login"
                label="Login"
                placeholder="login"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div className="mt-5">
              <Input
                type="password"
                name="senha"
                label="senha"
                placeholder="********"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>
          {erro ? (
            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
              {erro}
            </span>
          ) : (
            <></>
          )}
          <div>
            <Button
              disabled={loading}
              type="submit"
              className="w-full mt-6 tracking-widest border-b-blue-600 bg-blue-500 py-3 text-white font-bold hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400"
            >
              {loading ? "Carregando..." : "Criar conta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
