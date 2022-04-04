# aula 4 - comunicação com a API

Voltamos novamente a atenção ao nosso frontend, após uma breve revisão dos conceitos básicos de um API. Em nossa aula de hoje, vamos integrar o frontend do medium com nossa API.

## Sobre nossa API

Ontem estudamos brevemente a estrutura da nossa API do app medium. Abaixo, vamos detalhar um pouco mais as responsabilidades de cada um de nossos endpoints.

### POST /auth/login

Rota responsável por autenticar nosso usuário. Ontem, cada um criou um (ao menos um...) usuário na API. Através desta rota de autenticação, esperamos que este usuário nos credencie ao uso do app. Desta forma, **esta será a rota que usaremos na tela de autenticação de nosso usuário**.

Um fato importante que precisamos reparar: o retorno desta rota nos entrega dois dados importantes para o uso da API: o primeiro deles, o `access_token`, é um token no formato [jwt](https://jwt.io/introduction), utilizado para que nosso usuário seja reconhecido pela API. Como algumas de nossas rotas são exclusivas para determinados usuários, é necessário que todas as nossas comunicações, após o login do usuário, trafeguem este dado para a API. Uma forma comum de usar este token, e que também adotamos em nossa API é envia-lo a cada request através do header `Authorization`. Ainda seguindo o padrão de utilização, este token é acompanhado da string [bearer][https://oauth.net/2/bearer-tokens/#:~:text=Bearer%20Tokens%20are%20the%20predominant,such%20as%20JSON%20Web%20Tokens.]. Espera-se, então, que após a autenticação, nossas rotas sejam chamadas como o exemplo abaixo:

```sh
curl -X 'GET' \
  'http://3.221.159.196:3307/artigos/meus-artigos?titulo=1' \
  -H 'accept: application/json' \
  -H 'Authorization: bearer <conteúdo de response.body.access_token>'
```

### POST /usuarios

Rota de criação de usuários. Para o propósito desta aplicação, esta rota é privada, ou seja, somente usuário autenticados podem criar novos usuários. Esta rota, também um POST, espera o envio do nome, login e senha do nosso usuário. Segundo as especificações do nosso projeto, esta rota não deverá ser utilizada em nosso app. Ela somente nos é útil para criar nossos usuários.

```sh
curl -X 'POST' \
  'http://3.221.159.196:3307/usuarios' \
  -H 'accept: */*' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjJ9LCJpYXiOjE2NDg3NDM5OTAsImV4cCI6MTY0ODc2NTU5MH0.WT86G_KV1scJsXlwma86XTt4elVXtIdMIHRrl2UMmqI' \
  -H 'Content-Type: application/json' \
  -d '{
    "nome": "Alan Turing",
    "login": "alan.turing",
    "senha": "B0mb@"
  }'
```

### GET /artigos

Rota de listagem de todos os artigos disponíveis na base. Como usuários não logados também podem acessar artigos, esta rota é aberta. Ela será util para a composição da nossa tela de home.

```bash
curl -X 'GET' \
  'http://3.221.159.196:3307/artigos' \
  -H 'accept: application/json'
```

Caso você implemente uma busca pelo titulo do artigo, você pode usar a query string `titulo`

```bash
curl -X 'GET' \
  'http://3.221.159.196:3307/artigos?titulo=olá mundo' \
  -H 'accept: application/json'
```

### GET /artigos/meus-artigos

Rota de busca dos artigos do usuário. Esta rota deverá ser utilizada pelo usuário logado para acessar os artigos dele. As regras de operação desta rota são muito semelhantes às da listagem pública, exceto, claro, por ela demandar que o usuário esteja autenticado.

```bash
curl -X 'GET' \
  'http://3.221.159.196:3307/artigos/meus-atigos' \
  -H 'accept: application/json'
```

Caso você implemente uma busca pelo titulo do artigo, você pode usar a query string `titulo`

```bash
curl -X 'GET' \
  'http://3.221.159.196:3307/artigos/meus-atigos?titulo=olá mundo' \
  -H 'accept: application/json'
```

### GET /artigos/{id}

Rota de busca dos detalhes de um artigo. Esta busca deve ser operada informando o id do artigo que pretendemos encontrar na base. Assim como a listagem a leitura de um artigo específico também é uma ação livre, por isso, não requer autenticação.

```bash
curl -X 'GET' \
  'http://3.221.159.196:3307/artigos/100' \
  -H 'accept: application/json'
```

### POST /artigos

Rota de criação dos artigos. Esta rota espera, dentro do body da requisição, o envio do título, resumo, imagem, em formato de base64 (vamos fazer isso juntos) e o conteúdo do nosso artigo, em uma longa string em formato markdown.

Importante notar que, como todo artigo precisa estar "assinado" pelo nosso usuário, esta rota é autenticada.

```bash
curl -X 'POST' \
  'http://3.221.159.196:3307/artigos' \
  -H 'accept: */*' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjJ9LCJpYXiOjE2NDg3NDM5OTAsImV4cCI6MTY0ODc2NTU5MH0.WT86G_KV1scJsXlwma86XTt4elVXtIdMIHRrl2UMmqI' \
  -H 'Content-Type: application/json' \
  -d '{
    "titulo": "A história de Alan Turin e a construção da Bomba",
    "imagem": "base-64-imagem",
    "resumo": "Saiba mais aqui como Alan Turin construiu a bomba, uma máquina que definiu os rumos da segunda guerra",
    "conteudo": "longo-texto-em-formato-markdown"
  }'
```

### PATCH /artigos/{id}

Rota de atualização de artigo. Somente o usuário compositor do artigo poderá utilizar esta rota para atualizar o artigo. Esta operação requer os mesmos campos da criação do artigo. Ela porém, pede a informação do id do artigo que desejamos atualizar.

Caso um usuário tente atualizar um artigo sem estar autenticado, ou tente modificar um artigo de outro usuário, o servidor retornará um erro de 403. Não se esqueça de validar este erro no frontend!

```bash
curl -X 'PATCH' \
  'http://3.221.159.196:3307/artigos/100' \
  -H 'accept: */*' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjJ9LCJpYXiOjE2NDg3NDM5OTAsImV4cCI6MTY0ODc2NTU5MH0.WT86G_KV1scJsXlwma86XTt4elVXtIdMIHRrl2UMmqI' \
  -H 'Content-Type: application/json' \
  -d '{
    "titulo": "A história de Alan Turin e a construção da Bomba",
    "imagem": "base-64-imagem",
    "resumo": "Saiba mais aqui como Alan Turin construiu a bomba, uma máquina que definiu os rumos da segunda guerra",
    "conteudo": "longo-texto-em-formato-markdown"
  }'
```

### DELETE /artigos/{id}

Rota de exclusão de artigo. Somente o usuário compositor do artigo poderá utilizar esta rota para excluir o artigo. Esta operação requer o id do artigo que desejamos excluir.

Para fazer a exclusão, você terá que incluir um novo botão na tela de edição de artigos. As mesmas validações de permissão e autorização de update devem ser levadas em conta aqui.

```bash
curl -X 'DELETE' \
  'http://3.221.159.196:3307/artigos/100' \
  -H 'accept: */*' \
  -H 'Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjJ9LCJpYXQiOjE2NDg3NDM5OTAsImV4cCI6MTY0ODc2NTU5MH0.WT86G_KV1scJsXlwma86XTt4elVXtIdMIHRrl2UMmqI'
```

## Comunicando o app com a API

Nosso app deverá intergir com uma API RESTFul. Ou seja, vamos utilizar uma comunicação HTTP, para prover as funcionalidades. Para construir esta comunicação, vamos utilizar como **cliente http** o [axios](https://axios-http.com/docs/intro). Esta biblioteca é largamente utilizada no ambiente de react.

> Atualmente, as versões mais recentes do create-react-app nos permite a utilização do `fetch`, o cliente http nativo dos browsers mais modernos. Apesar desta possibilidade ser totalmente funcional, e ter as mesmas possibilidades do axios, como o uso de promises, o axios possui alguns utilitários, como interceptors de requests, que serão muito uteis para nossa implementação em breve.

Para o primeiro passo do nosso roteiro, vamos instalar o pacote:

```bash
npm install axios
```

Pacote instalado, já estamos prontos para conectar nosso primeiro endpoint!

### Autenticando nosso usuário

Atualmente, nossa página de login não possui muita "inteligência": ela simplesmente renderiza a nossa página de login, sem se preocupar muito sobre as questões mais práticas da aplicação. Antes ainda de nos comunicar com a API, vamos garantir que a tela de login seja capaz de capturar o formulário do usuário, para enfim, enviar os dados ao servidor. Para isso, vamos:
  - adicionar os states de login e senha do usuário
  - adicionar os eventos de captura das mudanças dos inputs
  - criar o evento a ser disparado quando o usuário fizer o `submit` do formulário.
  - integrar o evento ao nosso endpoint de login.

#### passo 1: adicionar os states de login e senha do usuario

```tsx
// src/components/Login/index.tsx, aproximadamente no inicio da página
const [login, setLogin] = useState("");
const [senha, setSenha] = useState("");
```

#### passo 2: adicionar os eventos de captura das mudanças dos inputs

Ainda no componente de login, vamos adicionar duas propriedades nos campos de input: A primeira delas, o `value`, permite ao react saber qual o valor atual nos campos de login e senha. O `onChange` é um evento que deverá capturar cada um dos eventos de alteração do campo, e a cada vez que o campo for alterado, deverá atualizar o state do componente.

```diff
// src/components/Login/index.tsx, nos inputs
<Input
  type="text"
  name="login"
  label="Login"
  placeholder="login"
  required
+  value={ login }
+  onChange={ (e) => setLogin(e.target.value) }
/>
{ /*...*/ }
<Input
  type="password"
  name="senha"
  label="senha"
  placeholder="********"
  required
+  value={ senha }
+  onChange={ (e) => setSenha(e.target.value) }
/>
```

Com estes campos adicionados, vamos ver que o compomente não é capaz de entender os eventos. Isso acontece porque nosso componente de input, um componente customizado para nosso tema, não sabe ainda captar e tratar os eventos. vamos alterar também nosso componente:

```diff
// src/components/Input/index.tsx
import React, { HTMLInputTypeAttribute } from "react";

export type InputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute | 'textarea';
  required?: boolean;
+  value?: string;
+  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder = '',
  type,
  required = false,
  value,
  onChange,
}) => {
  const inputClassNames = `
    rounded-lg border border-gray-300 px-4 py-2 w-full
    block w-full p-3 mt-2
    text-gray-700 bg-gray-100 focus:bg-gray-150 focus:shadow-inner
    appearance-none focus:outline-none
  `;

  return (
    <>
      <label
        htmlFor={ name }
        className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
      >{ label }</label>
      {
        type === 'textarea' ?
          (
            <textarea
              id={ name }
              rows={ 2 }
              name={ name }
              placeholder={ placeholder }
              required={ required }
              className={ inputClassNames }
+              value={ value }
+              onChange={ onChange }
            /> 
          ) :
          (
            <input
              id={ name }
              type={ type }
              name={ name }
              placeholder={ placeholder }
              className={ `${inputClassNames} resize-none` }
              required={ required }
+              value={ value }
+              onChange={ onChange }
            />
          )
      }
    </>
  );
};
```

com isso, nosso app já é capaz de capturar as alterações dos inputs.

#### passo 3: criar o evento a ser disparado quando o usuário fizer o `submit` do formulário.

Já temos states sendo atualizados com o input do usuário. Vamos capturar estes states após o click do usuário no botão de submit. Segue Snippet:

```tsx
// src/components/Login/index.tsx
// logo abaixo as declarações de state.
function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
  // esta linha impede que o formulário execute o comportamento padrão
  // de submit da página, seguido de um reload. este comando é comum para
  // vários eventos os js, e nos permite customizar por completo o uso
  // deste. Docs: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
  event.preventDefault();
  console.log('login', login);
  console.log('senha', senha);
}

{/*
form do componente renderizado
estamos adicionando a autenticação ao evento de subtmit do form, não
de click do botão de submit. Isto é bastante util em forms, pois eles
nos permite, por exemplo, utilizar as validações dele, e submeter o
login através de um click
*/}
<form className="mt-8 space-y-6" onSubmit={autenticaUsuario}>
```

Com estas alterações, já temos o form sendo capturado, e o evento de confirmação dos dados sendo construído.

#### passo 4: integrar o evento ao nosso endpoint de login.

Finalmente, estamos prontos para conectar as pontas. Para que isso aconteça, vamos adicionar a requisição de login, que deverá ocorrer no momento que o usuário submete o formulário.

Como já temos o axios instalado em nosso projeto, vamos utiliza-lo imediatemente no login.

```tsx
async function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const url = `http://3.221.159.196:3307/auth/login`;
  const response = await axios.post(
    url,
    { login, senha }
  );

  const { access_token, id } = response.data;
  console.log(response.status);
  console.log(access_token, id);
}
```

estudo do caso:
  - O axios possui métodos específicos para cada verbo http que utilizamos em nossas APIs. Neste caso, como o login é um post, vamos utilizar o método post.
  - O primeiro parâmetros dos métodos do axios é a url. Como vamos operar um login, preciso passar o endereço completo da requisição.
  - O post do axios, assim como todos os demais verbos que nos permitem trafegar um body, aceitam um segundo parâmetro. Dado que a autenticação espera receber login e senha, estes são os dados trafegados aqui.
  - Devemos nos lembrar sempre que o axios é um cliente http. Desta forma, ele interage com o protocolo. Repare que o resultado de uma consulta axios possui alguns componentes da resposta deste protocolo. Neste caso, estamos lidando com o `status`, que esperamos que seja o 200, e o `response.data`. Este segundo é a forma como o pacote abstrai o `body` de nossa resposta.
  - devemos sempre nos lembrar que chamadas a serviços externos são assíncronos, pois não sabemos quanto tempo será necessário para receber seus dados. **Sempre se lembre de operar consultas à API com um await, ou dentro de promises**.

Com esta estrutura de código, já temos nossa primeira comunicação com a API. A questão é que, apesar de autenticados, temos algumas questões importantes:
- A operação de autenticação ocorre, mas não fazemos nada com os dados recebidos.
- Se o login for válido, precisamos armazenar o token de acesso em um local persistente. Desta forma, por mais que o usuário atualize sua página, não é mais necessário que ele se autentique novamente.
- O usuário não tem qualquer informação sobre o status da operação. Ele não tem feebdback de sucesso ou erro.
- Ainda sobre feedback, o usuário não sabe quando a operação se iniciou, e quando ela foi encerrada. Seria interessante adicionar alguma forma de `loading`.
- O ideal é que o usuário seja redirecionado para a página inicial, caso faça um login com sucesso. Em caso de falha, precisamos mostrar uma mensagem de erro.

Vamos às melhorias!

#### redirecionar o usuário em caso de sucesso.

No cenário do login ser operado com sucesso, vamos redireciona-lo à pagina de seus artigos. Para isso, voltaremos ao `react-router-dom`, e vamos utilizar o hook customizado `useNavigate`. Da mesma forma que o `<Link />`, ele nos permite interagir com o sistema de navegação. A diferença principal é que com ele, a ação de redirecionar às rotas é feita pelo componente, não por intervenção do usuario.

Para utiliza-lo, precisamos criar um objeto de navegação, através da chamada ao hook. Logo abaixo da declaração dos states, vamos declarar a criação do navigate:

```tsx
// src/components/Login/index.tsx,
const navigate = useNavigate();
```

em seguida, já podemos fazer a navegação, em caso de sucesso

```tsx
// src/components/Login/index.tsx
async function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const url = `http://3.221.159.196:3307/auth/login`;
  const response = await axios.post(
    url,
    { login, senha }
  );

  const { access_token, id } = response.data;
  if (access_token) {
    navigate("/artigos");
  }
}
```

## Armazenar o token do usuário

Para a maioria das operações da nossa aplicação, precisamos do token da API. No nosso estado atual, não operamos nada com o token criado e retornado pela API. Precisamos armazena-lo, de forma que sempre que o usuário precisar chamar alguma rota da API, este esteja acessível para nosso sistema.

Existem diversas formas de [armazenar o token](https://javascript.plainenglish.io/where-to-store-the-json-web-token-jwt-4f76abcd4577), todas elas com vantagens e desvantagens. Para nosso cenário, vamos utilizar o [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), dispositivo nativo dos browsers para persistência de operações.

```diff
async function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = `http://3.221.159.196:3307/auth/login`;
    const response = await axios.post(
      url,
      { login, senha }
    );

    const { access_token, id } = response.data;
    if (access_token) {
+      localStorage.setItem("access_token", access_token);
+      localStorage.setItem("id", id);
      navigate("/artigos");
    }
  }
```

Através do comando `localStorage.setItem`, criamos um armazenamento local do browser, onde relacionamos o valor da resposta do token com uma chave "access_token". Para resgatar esta informação, basta utilizar o comando `localStorage.getItem("access_token")`. Isto será utilizado em breve.

## adicionar feedbacks para o usuário.

Estamos em um estágio da nossa aplicação onde as operações efetuadas com sucesso já estão devidamente tratadas. Queremos agora enriquecer a experiência de nosso usuário, informando-o caso alguma operação termine com falha, e qual o motivo da falha. Ainda, queremos que ele esteja ciente que a operação está em andamento (se ainda não tivemos uma resposta de nossa API), ou se ela já foi encerrada. Sem este tipo de tratamento, nosso usuário não teria a certeza se a operação foi iniciada ou não. Isto é uma experiência frustrante, e não deve ser seguida.

Uma fórmula comum para o tratamento de ambos os casos, de erro e de loading de tela é de adicionar dois novos estados em nossa aplicação: uma de `loading` e outra de `erros`. Esta primeira deverá ser ativada quando a operação iniciar, e deverá ser desativada quando a operação terminar, seja em sucesso ou falha. A segunda, de erros, deve ter um texto a ser exibido ao usuário, em caso de erro.

Vamos começar adicionando `loading` à nossa tela:

```tsx
// src/components/Login/index.tsx, aproximadamente no inicio da página
export const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  // importante que o login se inicie em false, pois o estado normal da tela é de que
  // "não estamos esperando resposta: estamos à postos".
  const [loading, setLoading] = useState(false);
  // ...
```

```tsx
// src/components/Login/index.tsx
async function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // ao inicio da operação, ativamos o loading. Este ficará ativo até que haja uma
    // nova atualização do estado, "desligando" o loading.
    setLoading(true);
    const url = `http://3.221.159.196:3307/auth/login`;
    const response = await axios.post(
      url,
      { login, senha }
    );

    const { access_token, id } = response.data;
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("id", id);
      navigate("/artigos");
    }

    // seja por sucesso ou falha, nossa operação já se encerrou. Hora de desligar o loading.
    setLoading(false);
  }
```

A parte final do comportamento de loadin seria adicionar uma informação de espera na tela. Uma forma interessante é modificar o botão de submit da nossa tela. A alteração abaixo produz dois resultados: Altera a label do botão para "Carregando...", quando o loading estiver ativo, e ainda desabilita sua operação, no mesmo cenário

```tsx
<Button
  disabled={loading}
  type="submit"
>{ loading ? 'Carregando...' : 'Entrar' }</Button>
```

Agora sim, nosso app já diz ao usuário o status de nossa operação. Última operação importante, vamos adicionar erros à tela. Primeira parte, sem muito segredo, vamos adicionar um state de `erro`:

```tsx
// src/components/Login/index.tsx, aproximadamente no inicio da página
export const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  // ...
```

Novamente, vamos alterar nosso método de autenticação. Como pode-se ver abaixo, o `axios` produz uma excessão quando há um erro http. Vamos alterar um pouco da nossa chamada ao método de API, colocando um tratamento de try/catch, para avaliar o erro recebido. Seja qual for, vamos adiconar as devidas mensagens para nosso usuario

```tsx
// src/components/Login/index.tsx
async function autenticaUsuario(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  // este comando está limpando possíveis erros na rodada anterior. Caso não
  // adicione isso, a mensagem de erro fica na tela mesmo após outra tentativa.
  // isso causa uma certa confusão no usuário.
  setErro('');
  setLoading(true);

  try {
    const url = `http://3.221.159.196:3307/auth/login`;
    const response = await axios.post(
      url,
      { login, senha }
    );

    const { access_token, id } = response.data;
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("id", id);
      navigate("/artigos");
    }
  } catch (error: any) {
    // em caso de erro de autenticação (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401),
    // enviamos uma mensagem específica para "usuário ou senha inválidos"
    if (error.response.data.statusCode === 401) {
      setErro('Usuário ou senha Inválidos');
    } else {
      setErro('Erro ao autenticar usuário. Tente novamente mais tarde.');
    }
  }

  // repare que o setLoading é chamado após tudo. Ele será executado, seja em
  // cenário de sucesso, ou de falha.
  setLoading(false);
}
```

Último passo, para finalmente acabarmos esta conexão (será???), devemos informar o usuário em caso de erros:

```tsx
// src/components/Login/index.tsx
{
  erro ? (
    <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
      { erro }
    </span>
  ) : <></>
}
<div>
  <Button
    disabled={loading}
    type="submit"
  >{ loading ? 'loading...' : 'Entrar' }</Button>
</div>
```

UFA!!! Acho que tenho uma tela de autenticação finalmente!

### Listando meus artigos

Começamos tudo outra vez! Mas desta vez, nosso requisito é um pouco mais simples: vamos buscar a lista de artigos do usuário logado. Como nossa página `src/pages/MeusArtigos/index.tsx` já possui um state que corresponde à lista de artigos, vamos apenas modificar nosso método de busca dos artigos.

Atualmente, a página busca os artigos em uma lista, gerada aleatoriamente. Vamos alterar um pouco isso, fazendo a busca agora na API. Segue o mesmo modelo: axios

```tsx
// src/pages/MeusArtigos/index.tsx
async function buscaMeusArtigos() {
  // através de generics, posso informar ao axios o tipo de objeto que vamos
  // operar.
  const response = await axios.get<ArticleThumbnailProps[]>(
    'http://3.221.159.196:3307/artigos/meus-artigos'
  );
  setArticles(response.data);
}

useEffect(() => {
  buscaMeusArtigos();
}, []);
```

Testando... Ops! Não deu certo. A rota é autenticada! Precisamos adicionar o token à chamada. Segue o snippet:

```tsx
// src/pages/MeusArtigos/index.tsx
async function buscaMeusArtigos() {
  const token = localStorage.getItem("access_token");
  // através de generics, posso informar ao axios o tipo de objeto que vamos
  // operar.
  const response = await axios.get<ArticleThumbnailProps[]>(
    'http://3.221.159.196:3307/artigos/meus-artigos',
    {
      headers: {
        'Authorization': `bearer ${token}`
      }
    }
  );
  setArticles(response.data);
}
```

Pronto. Artigos meus artigos listados. Mas ainda há um ponto importante: Nossa versão anterior permitia ao usuário ver o botão de "editar" de seus artigos. Este desapareceu, pois não estamos mais forçando o `editavel` em nossos artigos. Vamos fazer da forma correta agora.

Como manda nossa regra, somente o usuário autor pode alterar seu artigo. Se analisarmos a resposta da requisição de meus-artigos, vamos ver que ela retorna os dados do usuário para cada artigo. Voltando à tela de autenticação, conseguimos ver ainda que na resposta do login, armazenamos o id do usuário logado.

Para conseguirmos saber se o usuário logado é autor ou não de um artigo, precisamos verificar se o id do usuário logado é igual ao id do autor do artigo. Como este dado está em localstorage, ele pode ser acessado de qualquer lugar, como o componente de renderização da Thumbnail do artigo. 

```diff
// src/components/ArticleThumbnail/index.tsx
export const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({
  id,
  imagem,
  titulo,
  resumo,
  dataPublicacao,
  tempoLeitura = '7 min',
  autor,
-  editavel,
}) => {
  // criamos um state de editável, pois agora podemos calcular se ele deve ser editável ou
  // não.
+  const [editavel, setEditavel] = useState(false);

// adicionamos um effect, que deve ser atualizado a cada nova informação de autor. Este effect
// atualiza o state de `editavel` sempre que o autor for alterado.
+ useEffect(() => {
    // este Number(...) é necessário, pois o localStorage armazena strings. Nosso autor.id é
    // numérico.
+   const usuarioAtual = Number(localStorage.getItem('usuarioId'));
+   setEditavel(autor.id === usuarioAtual);
+ }, [autor]);
```

Prontinho! temos a tela de meus artigos implementada.

### Editando um artigo

Aqui vamos ser um pouco mais breves, mas vamos ao passo a passo. Vamos alterar o componente de edição de artigos, para encontrar o artigo através do id, passado em query param. Relembre-se que a rota de edição de artigos, `/artigos/editar/:id`, registra uma variável `:id`. Vamos consulta-la através do hook `useParams`. Para cada alteração de id encontrada, vamos buscar o artigo novamente.

```tsx
// src/pages/EditarArquivo/index.tsx
export const EditarArquivoPage = () => {
  const [ artigo, setArtigo ] = useState<ArticleThumbnailProps>();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      buscarArtigo();
    }
  }, [id]);

  async function buscarArtigo() {
    const token = localStorage.getItem("access_token");
    const response = await axios.get<ArticleThumbnailProps>(
      `http://3.221.159.196:3307/artigos/${id}`,
      {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }
    );

    setArtigo(response.data);
  }

  // ... 
```

Temos uma forma de buscar os artigos. Precisamos alterar o componente de `ArticleForm` para receber o artigo atual.

```tsx
// src/pages/EditarArquivo/index.tsx
return (
  <>
    <div className="items-center justify-center m-10">
      <ArticleForm article={artigo} />
    </div>
  </>
);
```

Muitas alterações em `ArticleForm`:

```tsx
// src/components/ArticleForm/index.tsx

// adicionamos article às props do Form
type ArticleFormProps = {
  article?: ArticleThumbnailProps;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  article
}) => {
  // armazenamos o estado do artigo a ser alterado. Todos os campos podem ser
  // alterados no form, então precisamos de states, para tornar o form reativo
  // a todos eles.
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagem, setImagem] = useState("");
  const [conteudo, setConteudo] = useState("");

  // novamente, a cada mudança de artigo, atualizamos os dados dos forms.
  useEffect(() => {
    if (article) {
      setTitulo(article.titulo);
      setResumo(article.resumo);
      setImagem(article.imagem);
      setConteudo(article.conteudo || '');
    }
  }, [article]);

  // este método transforma a imagem em base64. Esta operação nos permite
  // trafegar nossa imagem como uma string para a API. Não é a melhor escolha,
  // mas é a mais simpes... :)
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
          Hello there 👋,&nbsp;
          <span className="font-normal">please fill in your information to continue</span>
        </h1>
        <form className="mt-6">
          {/* Adicionamos o estado e o evento de alteração em todos os campos. */}
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
            placeholder="Breve rewsumo do artigo"
            type="textarea"
            name="resumo"
            label="Resumo"
            value={ resumo }
            onChange={(e) => setResumo(e.target.value)}
            required
          />

          <Input
            placeholder="Breve rewsumo do artigo"
            type="file"
            name="image"
            label="Banner"
            onChange={transformaImagemEmBase64}
            required
          />

          <RitchTextEditor
            label="Conteúdo"
            name="conteudo"
            value={ conteudo }
            onChange={ setConteudo }
          />

          <Button type="submit">Salvar</Button>
        </form>
      </div>
    </div>
  );
};
```

Mais alterações, necessárias agora no `RitchTextEditor`

```tsx
// src/components/RitchTextEditor/RitchTextEditor.type.ts
export type RitchTextEditorProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  // adicionamos value e onChange no input.
  value?: string;
  onChange?: (value: string) => void;
}
```

```tsx
// src/components/RitchTextEditor/index.tsx
export const RitchTextEditor: React.FC<RitchTextEditorProps> = ({
  label,
  name,
  // campos reativos no componente
  onChange,
  value,
}) => {
  const mdParser = new MarkdownIt();
  function handleEditorChange({ html, text }: any) {
    // a cada alteração no artigo, vamos atualizar o estado.
    if (onChange) { 
      onChange(text || '');
    }
  }

  function onImageUpload(file: any) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (data: any) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
  

  return (
    <>
      <label
        htmlFor={ name }
        className="block my-2 text-xs font-semibold text-gray-600 uppercase"
      >{ label }</label>
      <MdEditor
        style={{ height: '500px' }}
        renderHTML={text => mdParser.render(text)}
        value={value}
        onChange={ handleEditorChange }
        onImageUpload={onImageUpload}
      />
    </>
  );
};
```

Sim, é bastante, coisa... mas falta apenas um pequeno detalhe: Nosso formulário é capaz de receber informações de um artigo, editar estas informações, mas a persistência destes dados ainda não está sendo feita. Vamos configurar nosso componente para dizer à page como fazer a edição. Vou deixar a operação da API com vocês.


```tsx
// src/components/ArticleForm/index.tsx

type ArticleFormProps = {
  article?: ArticleThumbnailProps;
  // adicionamos uma propriedade de onSubmit, a ser disparada quando o usuário enviar o form.
  onSubmit?: (article: ArticleThumbnailProps) => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onSubmit
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
      setConteudo(article.conteudo || '');
    }
  }, [article]);

  // criamos um novo evento para este componente: sempre que o usuário 
  // fizer o submit do form, vamos enviar para o componente pai o artigo
  // que deve ser submetido.
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
      onSubmit(articleToSubmit as ArticleThumbnailProps)
    }
  }

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
          Hello there 👋,&nbsp;
          <span className="font-normal">please fill in your information to continue</span>
        </h1>
        {/* adicionamos aqui o evento de submit. */}
        <form className="mt-6" onSubmit={handleSubmit}>
{/* ... */}
```


```tsx
// src/pages/EditarArquivo/index.tsx

{/* ... */}
// este método reage à alteração do artigo. Nossa validação de que operação da API
// executar é bem simples: Se houver id, vamos atualizar o registro. Senão, vamos
// criar um novo.
const handleSubmit = (artigo: ArticleThumbnailProps) => {
    if (artigo.id) {
      console.log('=====> devo atualizar o artigo');
    } else {
      console.log('=====> devo criar um novo artigo');
    }
  }

  const handleSubmit = (artigo: ArticleThumbnailProps) => {
    if (artigo.id) {
      console.log('=====> devo atualizar o artigo');
    } else {
      console.log('=====> devo criar um novo artigo');
    }
  }

  return (
    <>
      <div className="items-center justify-center m-10">
        <ArticleForm
          article={artigo}
          {/* adicionamos aqui o evento de submit */}
          onSubmit={ handleSubmit }
        />
      </div>
    </>
  );
};
```

## Refatorações

Nossas rotas estão implementadas, e funcionam super bem, mas há alguns pontos de incômodo:

- todos os nossos componentes que se comunicam com a API precisam conhecer a url completa da API. Hoje estamos usando o endereço `3.221.159.196:3307`. Se quisermos alterar para `https://medium.raroacademy.com.br`, vamos ter algum problema
- todas as rotas que se comunicam com a API, com rotas autenticadas, precisam ficar buscando a chave de autenticação. Não quero ter que tomar esta decisão o tempo todo!

Para melhorar esta situação, vamos implementar um client customizado para nossa API. Este cliente deverá abstrair os comportamentos que citamos acima, e facilitar o uso de nossa api, dentro dos componentes.

O primeiro passo é criar o próprio cliente. Para isso, vou criar uma nova estrutura de arquivos, chamada `services`.

```tsx
// src/services/api-client.ts
import axios from 'axios';

// o método de axios.create() retorna um cliente customizado, que pode ser usado para criar requisições.
const axiosApiInstance = axios.create();

// aqui, estamos dizendo ao axios que nossa API se comunica com este 
// endereço de base. A partir de agora, toda chamada a nossa API receberá este 
// endereço base. Agora, somente precisamos chamar a rota específica  que estamos operando.
axiosApiInstance.defaults.baseURL = 'http://3.221.159.196:3307';

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
    const authorization = localStorage.getItem('access_token');
    if (authorization) {
      config.headers['Authorization'] = `bearer ${authorization}`;
    }

    return config;
	},
	error => {
		Promise.reject(error);
	},
);

export default axiosApiInstance;
```

Finalmente, finalizamos nossa refatoração, modificando nossas chamadas, antes diretamente com axios, para nosso cliente.

```diff
// src/components/Login/index.tsx
// aprox. linha 4
- import axios from 'axios';
+ import apiClient from '../../services/api-client';

// aprox. linha 24
- const url = `http://3.221.159.196:3307/auth/login`;
- const response = await axios.post(
+ const url = '/auth/login';
+ const response = await apiClient.post(
  url,
  { login, senha }
);
```

```diff
// src/pages/EditarArquivo/index.tsx

// aprox. linha 1
- import axios from 'axios';
+ import apiClient from '../../services/api-client'

// aprox. linha 18
- const token = localStorage.getItem("access_token");
- const response = await axios.get<ArticleThumbnailProps>(
-   `http://3.221.159.196:3307/artigos/${id}`,
-  {
-    headers: {
-      'Authorization': `bearer ${token}`
-    }
-  }
- );

+ const response = await apiClient.get<ArticleThumbnailProps>(
+   `/artigos/${id}`
+ );
```

```diff
// src/pages/MeusArtigos/index.tsx

// aprox. linha 1
- import axios from 'axios';
+ import apiClient from '../../services/api-client';

// aprox. linha 13
- const token = localStorage.getItem("access_token");
- const response = await axios.get<ArticleThumbnailProps[]>(
-   'http://3.221.159.196:3307/artigos/meus-artigos',
-   {
-     headers: {
-       'Authorization': `bearer ${token}`
-     }
-   }
- );

+ const response = await apiClient.get<ArticleThumbnailProps[]>(
+   '/artigos/meus-artigos'
+ );
```

## Práticas

Passamos por muita coisa hoje, verdade, mas precisamos terminar nossa aplicação. Implementamos até agora as funções de login e listagem de meus artigos completamente, mas precisamos finalizar os trabalhos.

Para isso, você precisará agora:
- integrar a tela de listagem de artigos à rota `GET /artigos`
- integrar os comandos de `PATCH /artigos/:id` e `POST /artigos` às demandas de atualização e criação de artigos. Você fará isso no método de handleSubmit do componente `src/pages/EditarArquivo/index.tsx`.
- integrar o comando de deletar artigos, `DELETE /artigos/:id`, à tela de edição do artigo. Sugiro uma abordagem semelhante aquela executada no handleSubmit.