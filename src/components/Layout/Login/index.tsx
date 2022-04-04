import apiClient from "../../../services/api-client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../Button";
import { Input } from "../../Input";

export const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  async function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setLoading(true);

    try {
      const url = "/auth/login";
      const response = await apiClient.post(url, { login, senha });

      const { access_token, id } = response.data;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("id", id);
        navigate("/my-articles");
      }
    } catch (error: any) {
      if (error.response.data.statusCode === 401) {
        setErro("Usuário ou senha Inválidos");
      } else {
        setErro("Erro ao autenticar usuário. Tente novamente mais tarde.");
      }
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
        <form className="mt-8 space-y-6" onSubmit={autenticaUsuario}>
          <div className="rounded-md shadow-sm -space-y-px">
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
              className="w-full mt-6 tracking-widest border-b-blue-600 bg-blue-500 py-3 text-white font-bold hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400">
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
