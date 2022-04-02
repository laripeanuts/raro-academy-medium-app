# aula 1 - iniciando nossa aplicação

## introdução

As aplicações que estamos trabalhando até agora são ainda bem simples: elas representam uma operação específica a ser feita pelo usuário do sistema, como por exemplo, jogar um jogo da velha. Mas esta não é a realidade da maioria das aplicações que construímos: o caso mais comum da rotina de trabalho de uma equipe de desenvolvimento é atuar em sistemas que apresentam diversas funcionalidades, com a apresentação de diversos recursos diferentes. Um exemplo deste tipo de necessidade é o Github: algumas das diversas funcionalidades que esta mesma ferramenta nos apresenta são:

- a [página principal](https://github.com/facebook/react), onde visualizamos algumas informações primárias do repositório
- a [listagem de issues](https://github.com/facebook/react/issues) ou a listagem de [PRs](https://github.com/facebook/react/pulls).
- a [tela de detalhamento de uma issue](https://github.com/facebook/react/issues/24170).

Como podemos ver, esta aplicação é composta por uma série de páginas diferentes, com diversos aspectos visuais, e principalmente, por ações diferentes. Podemos ver ainda que o endereço de cada uma destas páginas é diferente. Ou seja, o github, e quase todos os apps que vamos trabalhar, possuem um comportamento de navegação entre páginas.

Nesta semana, vamos desenvolver uma aplicação com este comportamento, de apresentação de funcionalidades diversas, que interagem entre si através de um dispositivo de navegação. Aproveitando isso, vamos nos aprofundar um pouco mais na utilização de uma API. Para este propósito, vamos trabalhar com uma aplicação onde diversos usuários publicam artigos com conteúdo de texto e imagens. Vamos desenvolver este projeto a partir de um repositório inicial, onde os componentes gráficos já estão iniciados.

## Requisitos da nossa aplicação

Seguem abaixo os requisitos básicos de nossa aplicação:

- Todos os artigos publicados em nosso portal são públicos, acessíveis para qualquer usuário, mesmo que estes não estejam logados. A página principal de nossa aplicação apresenta uma lista de thumbnails de nossos artigos.
- Um usuário pode selecionar um artigo, e acessar seu conteúdo completo.
- Usuários cadastrados na aplicação devem ter acesso ao painel administrativos, onde ele deverá interagir com os artigos de sua própria autoria. No painel administrativo, o usuário poderá:
  - listar seus artigos;
  - criar novos artigos;
  - abrir seu painel de edição;
  - remover artigos.
Ao final dos trabalhos, nossa aplicação deverá se comportar de forma semelhante a [esta](http://3.221.159.196:3308/). 
<!-- 
http://3.221.159.196:3307/api-docs/#/ -->

## Tour no projeto

- Para conseguirmos desenvolver todas as funcionalidades que desejamos, vamos trabalhar com um repositório dos componentes básicos já iniciados. Este repositório poderá ser acessado aqui [nesse link](https://github.com/pauloFernandes/raro-academy-medium-app).
- Este projeto foi iniciado com o [create-react-app](https://create-react-app.dev/), uma biblioteca que nos ajuda com o setup de aplicações react, em geral, basicamente com quase tudo que precisamos, para começar.
- Para estilização dos componentes, optamos pelo uso do [tailwind](https://tailwindcss.com/). Esta biblioteca nos ajuda a criar um template legal, através de estilos pré-definidos e de fácil acesso, através de classes utilitárias.
- Como já desejávamos apresentar nosso componentes, ainda somente "recortados", utilizamos o [storybook](https://storybook.js.org/), que nos permite criar um ambiente de desenvolvimento, onde podemos testar os componentes que desejamos, ainda sem integra-los à aplicação como um todo. Esta modalidade de trabalho tende a criar componentes melhor documentado e melhor separados entre si.