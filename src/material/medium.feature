# language: pt

Funcionalidade: Consumo dos artigos publicados
  Como usuário comum do sistema, logado ou em modo anônimo
  Quero ver a lista com todos os artigos publicados em nosso repositório

  Cenario: Lista de artigos publicados
    Dado que o usuário acesse o sistema de publicação de artigos
    Quando o usuário navega para a tela de home
    E existem artigos publicados
    Então devem ser apresentados todos os artigos publicados
    E os artigos deverão conter o título, o autor, a data de publicação e o resumo

  Cenario: Tela de listagem sem artigos publicados
    Dado que o usuário acesse o sistema de publicação de artigos
    E não existem artigos publicados
    Então o sistema deve apresentar uma mensagem dizendo que não existem artigos publicados

  Cenario: Acessar um artigo para leitura
    Dado que o usuário acesse o sistema de publicação de artigos
    Quando o usuário navega para a tela de home
    E o usuário selecionar um artigo
    Então deve ser apresentado o artigo selecionado
    E o artigo deverá conter o título, o autor e o conteúdo do artigo

Funcionalidade: Login na plataforma
  Como um usuário já cadastrado na plataforma
  Quero me autenticar no sistema
  Para que eu consiga criar e publicar artigos

  Cenario: Login realizado com sucesso
    Dado que o usuário acesse o sistema de publicação de artigos
    E que não esteja logado na plataforma
    Quando o usuário navega para a tela de login
    E se autentica com usuário e senha corretos
    Então o sistema redireciona este usuário para a tela de seus artigos

  Cenario: Login não realizado
    Dado que o usuário acesse o sistema de publicação de artigos
    E que não esteja logado na plataforma
    Quando o usuário navega para a tela de login
    E tenta se autenticar com usuário ou senha incorretos
    Então o sistema deve apresentar uma mensagem de erro "Usuário ou senha inválidos"
    E o sistema não redireciona este usuário para a tela de seus artigos
  
  Cenario: Logout do sistema
    Dado que o usuário acesse o sistema de publicação de artigos
    E que o usuário esteja logado na plataforma
    Quando o usuário clica na opção "Logout"
    Então o sistema deve deslogar o usuário e redirecionar este usuário para a tela listagem de artigos

Funcionalidade: Navegação na plataforma
  Como usuário comum do sistema, logado ou em modo anônimo
  Quero navegar pelas diversas Funcionalidade do sistema

  Cenario: Usuario não autenticado
    Dado que o usuário não esteja logado na plataforma
    E acesse o sistema de publicação de artigos
    Então o sistema deverá apresentar o menu de navegação para a tela de "home (listagem de artigos)"
    E o sistema deverá apresentar o menu de navegação para a tela de "login"

  Cenario: Usuario autenticado
    Dado que o usuário esteja logado na plataforma
    E acesse o sistema de publicação de artigos
    Então o sistema deverá apresentar o menu de navegação para a tela de "home (listagem de artigos)"
    E o sistema deverá apresentar o menu de navegação para a tela de "meus artigos"
    E o sistema deverá apresentar o menu de navegação para a tela de "novo artigo"
    E o sistema deverá apresentar o menu para logout

Funcionalidade: Gestão dos meus artigos
  Como um usuário já autenticado na plataforma
  Quero ver a lista dos artigos que eu publiquei
  Para que eu possa editar e excluir estes artigos

  Cenario: Usuário não possui artigos publicados
    Dado que o usuário autenticado acesse o sistema de publicação de artigos
    E navegue para a tela de meus artigos
    Quando o usuário não possui artigos publicados
    Então o sistema deve apresentar uma mensagem reportando que não há artigos publicados

  Cenario: Usuário possui artigos publicados
    Dado que o usuário autenticado acesse o sistema de publicação de artigos
    E navegue para a tela de meus artigos
    Quando o usuário possui artigos publicados
    Então o sistema deve apresentar todos os artigos publicados
    E o sistema deverá apresentar a opção de editar o artigo

  Cenario: Criar um novo artigo
    Dado que o usuário autenticado acesse o sistema de publicação de artigos
    E acesse a tela de novo artigo
    Quando o usuário preenche todos os campos do cadastro do artigo
    E clica em salvar
    Então o sistema deve salvar o artigo
    E redirecionar o usuário para a tela de exibição deste novo artigo

  Cenario: Editar um artigo
    Dado que o usuário autenticado acesse o sistema de publicação de artigos
    E acesse a tela de artigos ou de meus artigos
    E clique no botão de editar do artigo
    Quando o usuário preenche todos os campos do cadastro do artigo
    E clica em salvar
    Então o sistema deve salvar o artigo
    E redirecionar o usuário para a tela de exibição deste novo artigo

  Cenario: Excluir um artigo
    Dado que o usuário autenticado acesse o sistema de publicação de artigos
    E acesse a tela de edição de determinado artigo
    E clique no botão de excluir do artigo
    Então o sistema deve excluir o artigo
    E redirecionar o usuário para a tela de meus artigos