import axios from "axios";

const axiosApiInstance = axios.create();

// aqui, estamos dizendo ao axios que nossa API se comunica com este
// endereço de base. A partir de agora, toda chamada a nossa API receberá este
// endereço base. Agora, somente precisamos chamar a rota específica  que estamos operando.
axiosApiInstance.defaults.baseURL = "http://3.221.159.196:3307";

axiosApiInstance.interceptors.request.use(
  // este é um bloco bem interessante: estamos dizendo aqui ao axios
  // para interceptar toda requisição que fazemos. Este método é bem
  // util para adicionarmos configurações especiais às requisições.
  async (config: any) => {
    // aqui, injetamos nosso endereço base.
    config.url = `${axiosApiInstance.defaults.baseURL}${config.url}`;

    // e aqui, se houver uma chave de `access_token` em localStorage,
    // adicionamos automaticamente o header. Acabamos com a necessidade
    // de autentica manualmente nossas chamadas.
    const authorization = localStorage.getItem("access_token");
    if (authorization) {
      config.headers["Authorization"] = `bearer ${authorization}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosApiInstance;
