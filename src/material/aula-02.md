# aula 2 - Montando a aplicação com o sistema de roteamento.

- recapitulando os requisitos aplicação:
  - qualquer usuário pode acessar uma tela com a lista de todos os artigos
  - qualquer usuário pode acessar um artigo qualquer e consumir seu conteúdo
  - usuários podem fazer login na aplicação
  - usuários logados podem ver a lista com todos os seus artigos
  - usuários logados podem criar, editar e deletar artigos.
- Este tipo de aplicação exige que nossos usuários possam **navegar** por diferentes telas, cada uma com seu próprio aspecto, regras e funções.
- Ele nos demanda ainda que algumas das telas sejam acessíveis somente para usuários que atendam a determinadas condições. No nosso caso, o `CRUD` de artigos deve ser acessível somente para os usuários logados na nossa aplicação.

## react router

- Como foi dito nas aulas anteriores, o react é uma biblioteca de construção de interfaces gráficas`*`. Funções mais específicas, como a navegação entre funcionalidades, deve ser obtida a partir de outras bibliotecas acopladas à nossa aplicação, como é o caso do [react router](https://reactrouter.com/).
- Esta é provavelmente a principal biblioteca de roteamento utilizada no ambiente de react. Ela nos permite declarar nossas rotas e regras de acesso para os recursos disponibilizados por elas.
- o react-router é arquitetado para funcionar junto com o react, em qualquer ambiente que ele esteja em execução (e.g. react web e react native). Para as aplicações na web, vamos usar o react-router-dom.

## primeiros passos

> **Obs.:** o mais comum nos projetos atuais da Raro é a utilização do react-router-dom versões 4 ou 5. A versão 6, mais recentemente lançada, inclui algumas alterações importantes de estrutura, que acabam facilitando o trabalho. Vamos adotar esta versão.


```bash
npm install react-router-dom@6
npm start # a aplicação será inicada no endereço http://localhost:3000
```

- Com o pacote instalado, podemos agora configurar nossa aplicação para permitir o uso de rotas. Precisamos declarar as nossas rotas próximas à raiz do projeto React. para isso, vamos alterar o arquivo App.tsx, adicionando o seguinte bloco (por enquanto...).


```tsx
/*App.tsx*/
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<ArtigosPage />} />
    <Route path="/artigo/:id" element={<ArtigoPage />} />
    <Route path="/artigos" element={<MeusArtigosPage />} />
    <Route path="/artigos/editar/:id" element={<EditarArquivoPage />} />
    <Route path="/artigos/novo" element={<EditarArquivoPage />} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

Esta configuração já adiciona algumas informações importantes para a nossa aplicação:
- O `BrowserRouter` é o componente recomendado pela biblioteca para o roteamento. Ele nos diz que, para alternar entre uma tela e outra, eu preciso alterar a url da minha aplicação. Conforme está implementado acima, eu precisaria acessar `http://localhost:3000/login` para acessar a tela de login e `http://localhost:3000`, para acessar a lista de artigos públicos.
- A grande vantagem de se utilizar desta estrutura é que podemos usar ao nosso favor o modelo de navegação do browser, que o nosso cliente já conhece o funcionamento. Desta forma, se o usuário sai da tela de artigos para a tela de login, ele pode usar o botão de voltar do Browser, para ir à tela anterior. 

> Detalhes sobre o BrowserRouter e suas alternativas podem ser encontrados na [documentação](https://reactrouter.com/docs/en/v6/api#browserrouter).

- o componente de `Routes`, em parceria com a lista de componentes `Route` funcionam como uma forma de switch/case das rotas. Conforme descrito acima, todas as vezes que a rota (URL) da minha aplicação for alterada, o `Routes` vai varrer todos os `Route`'s, comparando a propriedade `path` com a nova url. Caso encontre, ele deverá renderizar o componente presente em `element`, e encerra a busca. Caso nenhuma rota seja encontrada, temos a última rota, que renderiza nosso componente de `PageNotFound`.

- Note que nosso router, neste momento, está utilizando componentes na propriedade de `element` que até o momento não existem no nosso código. Estes componentes, a serem roteados, ainda precisarão ser criados, pois nossos componentes já existentes, e disponibilizados no storybook têm algumas dependências que não devem ser pelo router. Por isso, vamos criar uma nova estrutura, chamada de `pages`. É comum ver projetos onde adota-se uma pasta de componentes que podem ser utilizados exclusivamente para serem listados nas rotas. Abaixo, vamos criar todos os componentes de páginas, necessários para nossa navegação no app:

```tsx
/* src/pages/Login/index.tsx */
import { Login } from "../../components/Login";

export const LoginPage = () => {
  return (
    <Login />
  );
};
```

```tsx
/* src/pages/NotFound/index.tsx */
export const NotFoundPage = () => (
  <div className="flex items-center justify-center w-screen h-screen bg-indigo-600">
    <p className="text-5xl text-white md:text-7xl lg:text-9xl">404</p>
  </div>
);
```

- este componente vai gerar algumas alterações no sistema. Espero que você consiga as resolver 🙃
```tsx
/* src/pages/Artigos/index.tsx */
import { useEffect, useState } from "react";
import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { geraArtigos } from "../../stories/helpers/gerador-artigos";

export const ArtigosPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);

  useEffect(() => {
    setArticles(geraArtigos(10));
  }, []);

  return (
    <div className="my-30">
      <ArticleList
        articles={articles}
      />
    </div>
  );
};
```

```tsx
/* src/pages/Artigo/index.tsx */
import faker from "@faker-js/faker";
import { useState, useEffect } from "react";
import { ArticleView } from "../../components/ArticleView";

export const ArtigoPage = () => {
  const [article, setArticle] = useState<string>('');
  const [autor] = useState({
    nome: faker.name.firstName(),
    avatar: faker.image.avatar(),
  });
  const [dataPublicacao] = useState(new Date());

  useEffect(() => {
    async function loadArticle() {
      // este article.md precisa ser adicionado, temporariamente ao nosso código. Podemos copiar este conteúdo dentro da nossa pasta /public.
      // sugiro que você retire este documento de `src/stories/assets/markdown/article.md`
      const response = await fetch('/article.md');
      const article = await response.text();
      setArticle(article);
    }
    
    loadArticle();
  }, []);

  return (
    <div className="m-10">
      <ArticleView
        article={article}
        autor={autor}
        dataPublicacao={dataPublicacao}
        tempoLeitura={ '10min' }
      />
    </div>
  );
};
```

```tsx
/* src/pages/MeusArtigos/index.tsx */
import { useEffect, useState } from "react";

import { ArticleList } from "../../components/ArticleList";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";
import { geraArtigos } from "../../stories/helpers/gerador-artigos";

export const MeusArtigosPage = () => {
  const [articles, setArticles] = useState<ArticleThumbnailProps[]>([]);

  useEffect(() => {
    setArticles(
      geraArtigos(5).map((artigo) => ({ ...artigo, editavel: true }))
    );
  }, []);

  return (
    <div className="my-30">
      <ArticleList articles={articles} />
    </div>
  );
};

```


```tsx
/* src/pages/EditarArquivo/index.tsx */
import { ArticleForm } from "../../components/ArticleForm";

export const EditarArquivoPage = () => {
  return (
    <>
      <div className="items-center justify-center m-10">
        <ArticleForm />
      </div>
    </>
  );
};

```

## navegando no app

- com o exemplo que construímos acima, o usuário é capaz de navegar somente modificando a url. O ideal é que o usuário não precise conhecer todas as rotas da nossa aplicação para conseguir utiliza-la. Por isso, usamos os componentes de `<Link />`, também presentes na biblioteca do `react-router-dom`.
- O `Link` nada mais é que uma implementação do `<a href="" />`, mais especializada nas necessidades do `react-router-dom`. De forma semelhante ao `href`, o link tem um `to`, onde ele determina a rota para onde o link nos aponta. A vantagem de utilizar o `Link`, em comparação ao `a href` nativo, é que este segundo precisaria conhecer possíveis alterações de caminhos do projeto, caso estes ocorram.
- Vamos criar um novo componente, responsável pela navegação de nosso app. Este componente, por hora, terá um link para cada ponto do nosso sistema a ser acessado.

```tsx
/* src/components/Navigation/index.tsx */
import { Link } from 'react-router-dom';


export const Navigation = () => {
  return (
      <>
        <Link to="/">Home</Link>
        <Link to="/artigos">Meus Artigos</Link>
        <Link to="/artigos/novo">Novo Artigo</Link>
      </>
  );
};
```

- E, para tornar mais agradável o visual da nossa aplicação, vamos também adicionar um header, contendo alguns estilos. Este header deverá utilizar o componente de Navigation, para permitir ao meu usuário a navegação

```tsx
/* src/components/Header/index.tsx */
import { Navigation } from "../Navigation";

export const Header = () => (
  <header className="flex items-center justify-between px-10 py-6 bg-gray-200">
    <div className="flex items-center space-x-2">
      <img
        className="h-full w-28"
        src="https://rarolabs.com.br/assets/logo-cae9beb1976500005b5e29dea19bdaa2761082232703a16beb71ffd2117014e5.png"
        alt="Workflow"
      />
    </div>
    <nav className="flex items-center space-x-8 font-bold text-[#44c2fd]">
      <Navigation />
    </nav>
  </header>
);

```

- agora, basta adicionar o <Header /> em todos os componentes que precisam apresentar a barra de cabeçalho de nossa aplicação (oi???)
- brincadeira... Para não precisar repetir esta chamada ao header em todas as telas, vamos criar um componente de `Layout`, responsável por "abraçar" todas as telas que tenham um comportamento em comum. Neste caso, que possuem um header de navegação no topo. Segue snippet:

```tsx
/*
  src/components/Layout/index.tsx
*/
import { Outlet } from "react-router-dom";
import { Header } from "../Header";

export const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

```

- Repare que neste layout há um novo componente, importado do react-router-dom, chamado `Outlet`. Este componente permite ao router aplicar o conteúdo da página a ser apresentada para o usuário. Este outlet seria uma espécie de "placeholder", ou um componente a ser substituído pela página a ser apresetnada. Isto será feito de forma automática, desde que a gente edite um pouco nossos componentes de rotas, no arquivo `App.tsx`. Segue o snippet da modificação necessária:

```tsx
/*App.tsx*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<ArtigosPage />} />
          <Route path="/artigo/:id" element={<ArtigoPage />} />
          <Route path="/artigos" element={<MeusArtigosPage />} />
          <Route path="/artigos/editar/:id" element={<EditarArquivoPage />} />
          <Route path="/artigos/novo" element={<EditarArquivoPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- Repare que temos uma novidade: O nosso componente de layout passou representar a rota de `/`. Dentro da rota do componente `Layout`, temos uma série de rotas, que serão aplicadas no `Outlet` do nosso `Layout`. O react-router-dom nos permite criar subrotas, que podem, como neste cenário, carregar alguma estilização compartilhada por eles.
- Repare ainda que as rotas de "Login" e de "página não encontrada" não estão dentro do layout, pois, claro, eles não precisam desta navegação.

> Obs.: chegando aqui, notei que haviam alguns bugs visuais nos componentes de `ArticleList` e `ArticleThumbnail`. Os ajustes a seguir são necessários, para termos um visual legal para nossa aplicação:
> ```diff
> /* src/components/ArticleList/index.tsx */
> /* linha 9 */
> -    <div className="h-screen flex flex-col items-center justify-center mx-10 mt-10">
> +    <div className="flex flex-col items-center justify-center m-10">
> ```
>
> ```diff
> /* src/components/ArticleThumbnail/index.tsx */
> /* linha 15 */
> -    <div className="w-10/12 flex flex-col mt-5">
> +    <div className="flex flex-col w-2/3 mt-5">
> /* linha 34 */
> -        <div className="flex items-center" style={{ maxHeight: '100px' }}>
> -          <img className="mt-10" src={ imagem } />
> +        <div className="flex items-center h-[100px]">
> +          <img
> +            className="mt-10"
> +            src={imagem}
> +            alt={`imagem-do-artigo-${titulo}`}
> +          />
> ```

## Exercício prático

- Finalmente, após todos estes passos, temos nossa aplicação quase completamente "roteada". Existem ainda alguns pontos não implementados, que deixaremos para você resolver. São eles:
  - ao clicar nas imagens, ou em qualquer bloco de texto do `ArticleThumbnail`, o sistema deverá direcionar o usuário para a rota de `/artigo/:id-do-artigo`. **Dica:** Nossos artigos não possuem um id, segundo nossa tipagem. Você vai precisar resolver isso, e as consequências de adicionar um id, no arquivo `src/components/ArticleThumbnail/ArticleThumbnail.types.tsx`
  - ao clicar no botão de editar, do componente `ArticleThumbnail`, o usuário deverá ser redirecionado para a tela de `artigo/edit/:id-do-artigo`.
  - por último, não temos os itens de menu que nos direcionam para a tela de login, quando o usuário não está autenticado. Nem o botão de logout, para quando o usuário está logado. Por agora, basta criar ambos, e deixa-los disponíveis na nossa lista.