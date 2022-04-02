# aula 3 - Introdução à APIs

Nas aulas anteriores, falamos sobre o roteamento do nosso app. Ou seja, falamos da navegação visual esperado em nossa aplicação, ou da navegação de nosso frontend. Para esta aula, vamos mudar um pouco o foco da nossa aplicação, partindo agora para a outra face de nossa aplicação - o backend.

Semelhante ao que vemos na maioria das aplicações ou serviços terceiros que utilizamos, vamos tratar aqui de uma API RESTFull

## definição técnica

> API (Application Programming Interface) _"É um conjunto de rotinas e padrões estabelecidos por um software para a utilização das suas funcionalidades por aplicativos que não pretendem envolver-se em detalhes da implementação do software, mas apenas usar seus serviços"_
> **Fonte:** https://pt.wikipedia.org/wiki/Interface_de_programa%C3%A7%C3%A3o_de_aplica%C3%A7%C3%B5es

Ou seja, APIs em geral são padrões de programas que estabelecemos para que um app, construído de forma isolada, possa interagir com um segundo app, sem a necessidade de que este segundo app, provedor de um serviço qualquer, tenha que conhecer ou se preocupar com a implementação do primeiro.

> Em nosso jargão, é comum que desenvolvedores se refiram ao backend apenas como "a API". Não é inteiramente incorreto dizer isso, mas é importante que se entenda que API não se refere apenas à API do backend. Há diversas modalidades diferentes de APIs, como, por exemplo, a API de acesso aos recursos físicos de dispositivos andriod, ou o conjunto de operações que são disponibilizadas por um pacote npm que utilizamos para, por exemplo, acessar um banco de dados.

## API RESTFull

REST (_Representational State Transfer_) é uma arquitetura de construção de APIs baseada no protocolo HTTP, que define uma série de regras, ou mais corretamente, guias, sobre como estas APIs devem ser estruturadas. Estas regras tem como fim proporcionar às aplicações um ambiente de fácil escalabilidade e interoperabilidade.

### cliente-servidor

Aplicações REST devem seguir o [modelo cliente-servidor](https://pt.wikipedia.org/wiki/Modelo_cliente%E2%80%93servidor). Em resumo, a API funciona como provedor de serviços, tendo o conhecimento das regras de negócios, acesso aos bancos de dados, repositórios de assets, ou contato com outras APIs. O cliente desta API faz uma solicitação (request) http, transmitindo os dados da "pergunta" para o servidor. O servidor processa a solicitação do cliente e retorna uma resposta (response), para o cliente. 

Esta separação permite à API conhecer os requisitos para seu funcionamento, sem ter que lidar com as particularidades que cada cliente tem em funcionamento. Isso permite uma simplificação enorme da implementação da API, além de nos ajudar a projetar uma API que seja útil para mais de um cliente.


### Interface uniforme

Também chamada de "contrato" entre API e cliente, esta constraint nos ajuda definir algumas regras importantes sobre como criar as `rotas` ou `ações` da nossa API. O objetivo de determinar regras de como construir os `endpoints` da minha API é garantir que seus usuários, mesmo sem ter contato com a implementação, saibam o resultado esperado destas ações, apenas analisando a estrutura das requests.

Além de uniforme, esta API precisa ser documentada, para seu usuário ter acesso a todas as capacidades que esta API nos permite operar. Para esta documentação, uma boa ferramenta é o swagger.

Nesta constraint, determinam-se algumas regras de construção das ações: as requisições precisam enviar todas as informações de conhecimento do cliente, que são necessárias para que o servidor execute a ação. Ao término dela, o servidor, via response, precisa retornar ao cliente todas as informações relevantes. Esta comunicação segue regras específicas, utilizando sempre os recursos do protocolo HTTP. Estas regras estão detalhadas [[em outro documento]].

### Comunicação stateless

Cada fluxo de request/response deve possuir toda a informação necessária para a ação a ser operada. Caso não seja possível, é necessário prover ao servidor meios de alcançar toda a informação requerida para a operação.

Para exemplificar o caso, considere o cenário onde um cliente de um banco solicita à API de extrato financeiro as movimentações dos últimos 30 dias. O cliente precisa informar ao servidor os dados do usuário e o período da transação (a menos que o período esteja implícito, por definição documentada da API). Ao receber a requisição, o servidor precisa descobrir os dados relevantes do usuário, a partir das informações recebidas, e através disso, obter o extrato, conforme solicitado.

O contra-exemplo à esta constraint é a forma como aplicações stateful trabalham. Nesta abordagem, o usuário, ao logar em uma aplicação, inicia o que chamamos de "sessão", que seria o armazenamento de uma série de informações de determinado cliente no servidor. Toda vez que o usuário solicita uma informação, ela é obtida a partir dos dados persistidos na sessão. Este modelo stateful é desvantajoso, pois as requisições do cliente precisam ser atendidas por um servidor que tem seus dados registrados em memória. As aplicações modernas, que distribuem seus serviços por diversos servidores, precisariam armazenar esta informação em todos eles, ou atender um usuário somente pelo mesmo servidor, em todas as requisições.

### Cacheable

Esta premissa sugere que as ações de busca de conteúdo da API possam trabalhar com operações de cache. Ou seja, os dados solicitados pelo cliente possam ser armazenados em uma estrutura de mais rápido acesso, reduzindo o tempo gasto em operações de consulta, e reduzindo também a "pressão" exercida sobre os diversos recursos da API (ex.: banco de dados, rede de comunicação interna e o próprio serviço).

Quando utilizamos caches, é responsabilidade da API definir o período de duração deste cache.

### Construção em camadas

Esta premissa prevê que diversas responsabilidades possam ser distribuídas por diferentes camadas da aplicação, sem que a operação do usuário seja alterada por isso. Estas camadas, em um nível de desacoplamento satisfatório, nos permitem substituir as ferramentas utilizadas por outras, com uma dificuldade de separação pequena. Em APIs grandes, é comum a utilização de um apigateway, uma estrutura, externa à API, que nos ajudam suportar ações diversas, como a manutenção de caches, "descoberta" e comunicação de diversas APIs. Camadas de virtualização de APIs, por sua vez, nos permitem criar uma série de réplicas de uma mesma API, de forma que, caso a demanda aumente, ela possa ser atendida por uma quantidade maior de servidores de um mesmo serviço.


## Design de uma API RESTFull

Como vimos acima, existem diversas regras para a construção de uma API RESTFul. Neste bloco, vamos falar sobre aquelas que causam impacto ao cliente dela. Mais especificamente, vamos falar sobre como utilizamos a estrutura do protocolo HTTP para construir a comunicação entre nosso cliente e servidor.

Os exemplos apresentados aqui foram retirados de uma API responsável por gerenciar a aplicação de um jogo que temos na Raro, o "Bolão do Campeonato Brasileiro". Este app nos permite competir com todos os funcionários da empresa que gostam de futebol, onde "apostamos" os resultados dos jogos do campeonato brasileiro. Quanto mais próximos nossas apostas estiverem do resultado real, mais pontos fazemos.

Começaremos nossa análise a partir das requisições abaixo:

```bash
# listagem de todos os campeonatos da minha API
curl -X GET \
  'https://bolao.rarolabs.com.br/v1/campeonatos' \
  -H 'Accept: application/json' \
  -H 'Authorization: bearer b741dd48-c3f9-48d4-8346-71bda47c86e0' \
  -H 'x-transaction-id: 77f6fe6a-6a47-4451-ad83-d4b4cd296424'

# listagem de todos os colaboradores da Raro que podem jogar no bolão
curl -X GET \
  'https://bolao.rarolabs.com.br/v1/competidores' \
  -H 'Accept: application/json' \
  -H 'Authorization: bearer b741dd48-c3f9-48d4-8346-71bda47c86e0' \
  -H 'x-transaction-id: EB260F99-C114-4D66-9EA1-607C5A7F3CBA'

# rota de busca dos dados do competidor "paulo"
curl -X GET \
  'https://bolao.rarolabs.com.br/v1/competidores/61385649-0963-4db3-b6a1-ed6621f3c387' \
  -H 'Accept: application/json' \
  -H 'Authorization: bearer b741dd48-c3f9-48d4-8346-71bda47c86e0' \
  -H 'x-transaction-id: EB260F99-C114-4D66-9EA1-607C5A7F3CBA'
```

A primeira coisa que notamos é que ela possui um endereço raiz: `https://bolao.rarolabs.com.br/v1`. Ele nos informa que toda interação será operada em um servidor no endereço `bolao.rarolabs.com.br`. A comunicação será feita pelo protocolo `https`. Por último, ele nos informa também que estamos interagindo com as rotas da minha API na versão `v1`. Todo este caminho será uma constante em nossa API do bolão.


### resource

Ainda na url de nossa API, temos um complemento ao endereço raiz: `/campeonatos`, `/compedidores` e `/competidores/61385649-0963-4db3-b6a1-ed6621f3c387`. Cada um destes complementos caracterizam qual `recurso` da API estamos interagindo. Estes recursos são as entidades manipuladas pelo sistema. Nos exemplos acima, estamos consumindo APIs que interagem com a entidade de "Campeonato", para a primeira request, e "Competidor", na segunda e na terceira requests.

É sempre interessante que os recursos sejam identificados por **substantivos**, e que estes remetam sempre à Entidade que a rota opera. Ou seja, quando meu usuário chama uma rota de `/campeonatos`, esperamos que o retorno seja referente aos campeonatos existentes.

Existe um padrão comum de identificação dos recursos de APIs, onde chamadas à entidade no formato de `/campeonatos`, ou seja, somente o substantivo caracterizador da entidade, remetem à coleção de itens desta entidade. Neste exemplo, estamos lidando com todo o contexto da entidade. Quando nos referimos a um objeto em específico de nossa API, utilizamos um identificador único. O exemplo `/competidores/61385649-0963-4db3-b6a1-ed6621f3c387` seria uma possível chamada a uma operação direcionada ao objeto identificado pelo id `61385649-0963-4db3-b6a1-ed6621f3c387`.

### verbo

Chamamos de verbo da chamada o [método http](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) que utilizamos. Existe um padrão bem determinado na utilização dos verbos, para cada tipo de operação da nossa API. A utilização do verbo correto auxilia desenolvedores e utilizadores da API saberem que tipo de operação uma determinada rota está operando, mesmo sem conhecer os detalhes da sua implementação. Os métodos que utilizamos na API são:

#### GET

são as operações de busca de dados em uma API. As rotas identificadas pelo verbo `GET` devem apenas buscar dados na API, sem modificar os dados deste recurso.

As operações mais comuns que construímos com o método de GET são endpoints de `listagem` de dados ou `busca` de um elemento específico. A listagem, como dito anteriormente, é operada através de uma consulta somente ao substantivo da entidade. Por exemplo, `GET /campeonatos`. Para a busca de dados, utilizamos um identificador do registro, exemplo: `GET /campeonatos/brasileirao-2022`. A primeira operação nos permite listar uma série de itens daquela coleção, enquanto a segunda nos permite nos aprofundar mais nos dados, apenas de um elemento.

```bash
# listagem de todos os campeonatos da minha API. O resultado esperado de uma busca desta é um array, contendo
# todos os campeonatos da minha base de dados.
curl -X GET \
  'https://bolao.rarolabs.com.br/v1/campeonatos' \
  -H 'Accept: application/json' \
  -H 'Authorization: bearer b741dd48-c3f9-48d4-8346-71bda47c86e0' \
  -H 'x-transaction-id: 77f6fe6a-6a47-4451-ad83-d4b4cd296424'

# resposta
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{ "id": 1, "nome": "Campeonato Brasileiro", "ano": 2021, "slug": "brasileirao-2021" }, { "id": 2, "nome": "Campeonato Brasileiro", "ano": 2022, "slug": "brasileirao-2022" }]

# busca dos dados do campeonato brasileiro de 2022. Neste cenário, utilizamos um "slug"
# para identificar qual campeonato em específico estamos buscando. Nesta consulta, espera-se
# o retorno de um objeto apenas, com resultados mais detalhados em relação ao campeonato.
curl -X GET \
  'https://bolao.rarolabs.com.br/v1/campeonatos/brasileirao-2022' \
  -H 'Accept: application/json' \
  -H 'Authorization: bearer b741dd48-c3f9-48d4-8346-71bda47c86e0' \
  -H 'x-transaction-id: 77f6fe6a-6a47-4451-ad83-d4b4cd296424'

# resposta
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "id": 2, "nome": "Campeonato Brasileiro", "ano": 2022, "slug": "brasileirao-2022", "partidas": [] }
```

Uma característica interessante dos métodos de `GET`, principalmente os de listagem de itens. É comum que rotas de listagem nos permitam operar algumas `parametrizações` da operação de listagem. Estas parametrizações são utilizadas, principalmente, nas funções de filtro, ordenação e paginação dos itens retornados. Estas parametrizações são feitas através de [query string](https://en.wikipedia.org/wiki/Query_string), parte da URL que vem depois de um sinal de `?`, e que é sempre operada por pares `chave=valor`. A chamada abaixo busca todos os competidores que possuem o nome "silva"

```bash
curl -X GET \
  'https://bolao.rarolabs.com.br/v1/competidores?filter.nome=silva&pagination.page=1&pagination.per=20' \
  -H 'Accept: application/json' \
  -H 'Authorization: bearer b741dd48-c3f9-48d4-8346-71bda47c86e0' \
  -H 'x-transaction-id: 77f6fe6a-6a47-4451-ad83-d4b4cd296424'
```

#### POST

Operações identificadas pelo verbo `POST` são sempre utilizadas para criar novas entidades de determinado recurso. Os dados a serem inseridos em nosso resource são enviados no `body` da nossa requisição. No exemplo abaixo, estou adicionando um novo competidor em nossa API de jogos.

```bash
curl -X 'POST' \
  'https://bolao.rarolabs.com.br/v1/competidores' \
  -H 'accept: application/json' \
  -d '{ "nome": "Allan Turin", "login": "allan.turin", "senha": "3nigma" }'
```

Repare em uma característica interessante do aspecto desta rota: como o ato de inserir um novo elemento ao resource diz respeito à coleção como um todo, em geral, construímos esta rota apontando para todo o resource. Nossa rota acima aponta para `/competidores`, coleção onde estamos inserindo nossa nova entidade.

#### PUT e PATCH

Verbos utilizado para operações de alteração dos dados de determinada entidade. Utilizamos o `PUT` em rotas que pretendem alterar todos os dados de uma determinada entidade. A natureza da operação de PUT, de alterar um elemento em específico, se reflete na construção da rota, que, **em geral**, identifica o elemento a ser editado. Veja o exemplo abaixo:

```bash
curl -X 'PUT' \
  'https://bolao.rarolabs.com.br/v1/competidores/19120723' \
  -H 'accept: application/json' \
  -d '{ "nome": "Alan Turing", "login": "alan.turing", "senha": "B0mb4" }'
```

O `PATCH` é um verbo que também pode ser utilizado para editar um elemento. Este, porém, é mais utilizado para rotas que nos permitem alterar campos específicos de uma entidade

```bash
curl -X 'PATCH' \
  'https://bolao.rarolabs.com.br/v1/competidores/19120723/password' \
  -H 'accept: application/json' \
  -d '{ "senha": "Automatic-Computing-Engine-ACE-1946" }'
```

#### DELETE

Este verbo, por fim, é utilizado em rotas de remoção de entidades.

```bash
curl -X 'DELETE' \
  'https://bolao.rarolabs.com.br/v1/campeonatos/brasileirao-2022'
```

### Request Headers

Headers são estruturas que podem estar anexadas à request ou à response de nossa comunicação. Em geral, utilizamos os headers para passar informações complementares de nossa comunicação. São informações diversas, como:

- tipo de dados que estamos enviando (xml, json, texto...)
- tipo de dado que esperamos receber
- informações de duração do cache de uma chamada
- credenciais de autenticação do usuário na API.
- recursos de segurança adotado por browsers e demais clientes.

Existem diversos headers adotados por padrão pela comunidade de desenvolvimento, e utilizadas fortemente por browsers, para caracterizar a comunicação com a API. Estes headers podem ser encontrados [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).

fonte: https://restfulapi.net/rest-api-design-tutorial-with-example/

leituras complementares:
  - [Richardson Maturity Model](https://restfulapi.net/richardson-maturity-model/)
  - [Status codes](https://restfulapi.net/http-status-codes/)
  - [Convenção de nomes](https://restfulapi.net/resource-naming/)
