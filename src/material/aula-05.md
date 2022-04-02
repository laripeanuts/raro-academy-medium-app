# aula 05 - bloqueando rotas

Nossa aplicação está quase completamente implementada, mas temos um pequeno problema: usuários não autenticados conseguem acessar telas que deveriam ser restritas somente às pessoas logadas. Vamos corrigir isso imediatamente!

## criando navegações customizadas

Atualmente, para qualquer usuário, seja logado ou não, consegue ver todos os links de navegação. Nossa aplicação precisa ter o seguinte comportamento:

- usuários não logados:
  - pode ir para a tela de login
  - pode ir para a tela de home
  - pode navegar ler artigos
- usuários logados:
  - podem navegar para a home
  - pode navegar ler artigos
  - podem navegar para meus artigos
  - podem navegar para a tela de criação novo artigo
  - podem navegar para a tela de editar artigo
  - pode sair da aplicação

Para permitir este controle, a primeira parte é definir se nosso usuário está ou não autenticado. Faremos isso no componente de Navigation. Como já fizemos diversas vezes, isso será feito através de um `useState` e um `useEffect`. Na renderização de nosso componente, vamos criar duas versões: uma para usuários logados, e outra para não logados.

```tsx
// src/components/Navigation/index.tsx

export const Navigation = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated(localStorage.getItem("access_token") !== null);
  }, []);

  if(!isAuthenticated) { 
    return (
      <>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/artigos">Meus Artigos</Link>
      <Link to="/artigos/novo">Novo Artigo</Link>
      <Link to="/login">Login</Link>
      <Link to="/">Sair</Link>
    </>
  );
}
```

Aproveitando que estamos na tela de navegação, podemos aproveitar e criar o comportamento do botão de "Sair". Vamos criar um método `logout`. Este método deve:
  - remover os dados do usuário de localStorage;
  - atualizar o state de `isAuthenticated` para `false`;
  - navegar para uma tela pública da aplicação.

nosso `Navigation` vai ficar assim:

```tsx
// src/components/Navigation/index.tsx
export const Navigation = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated(localStorage.getItem("access_token") !== null);
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id");
    setAuthenticated(false);
    navigate('/');
  }

  if(!isAuthenticated) { 
    return (
      <>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/artigos">Meus Artigos</Link>
      <Link to="/artigos/novo">Novo Artigo</Link>
      <Link to="/" onClick={logout}>Logout</Link>
    </>
  );
};
```

Totalmente funcional! Uma pequena melhoria que podemos providenciar para nosso app: Eu gostaria de alterar um pouco a aparência do link da página atual. Isso ajuda nosso usuário se encontrar dentro da nossa aplicação. Para isso, vamos criar um link customizado, que deve ficar sublinhado, caso a rota atual seja a mesma rota para onde este link deve apontar. Chamarei este link customizado de `ActivableLink`

```tsx
// src/components/ActivableLink/index.tsx
type ActivableLinkProps = LinkProps & { type?: 'link' | 'button' };
export const ActivableLink: React.FC<ActivableLinkProps> = (props) => {
  const { type } = props;
  const match = useMatch(props.to.toString());
  const underlineClass = "border-[#44c2fd] border-b-2";
  const isButton = type === 'button';

  return (
    <Link
      className={ match && !isButton ? `${underlineClass}` : "" }
      {...props}
    />
  );
};
```

Repare no `useMatch`, mais uma operação do react-router-dom. Este método permite comparar a rota atual com uma string. Ele retorna true, caso as rotas coincidam. O restante do componente são coisas bem pequenas: estamos apenas adicionando classes que vão sublinhar o texto do link sempre que as rotas forem coincidentes. Fizemos ainda um pequeno tratamento com o `type`, uma propriedade que pode assumir os valores de `link` e `button`. Este é um pequeno ajuste, para nos permitir corrigir o fato do botão de `logout` ficar sublinhado quando o usuário estiver na tela de home. Agora, basta substituir todos os `<Link>`'s do Navigation por um `<ActivableLink>`. No logout, não se esqueça de adicionar a propriedade `type="button"`.

## Criação de rotas privadas

A navegação do usuário está corrigida, mas ainda temos um problema: caso o usuário não autenticado digite um `/artigos` na url, ele conseguirá acessar uma tela que ele não teria permissão. O correto que é que neste caso, o usuário seja **redirecionado** para fora, ou seja, volte para a tela de home.

Para construir este comportamento, vamos retomar um conceito que já utilizamos anteriormente. Vamos criar um conjunto de subrotas.

```tsx
// src/App.tsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<ArtigosPage />} />
        <Route path="/artigo/:id" element={<ArtigoPage />} />

        <Route element={ <RequireAuth /> }>
          <Route path="/artigos" element={<MeusArtigosPage />} />
          <Route path="/artigos/editar/:id" element={<EditarArquivoPage />} />
          <Route path="/artigos/novo" element={<EditarArquivoPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

No código acima, colocamos as rotas que devem estar protegidas de acesso indevido dentro de um novo subconjunto de rotas. Para este subconjunto, criamos um componente chamado `RequireAuth`. Seu comportamento será semelhante ao `Layout`, que fizemos algumas aulas atras: ele será o elemento renderizado quando houver `match` da rota. Internamente, se quisermos que nosso elemento protegido seja apresentado, usaremos o `<Outlet />`. Caso contrário, devemos redirecionar o usuário para a tela de home.

Desta forma, a implementação do componente de `<RequireAuth />` é conforme abaixo:

```tsx
// src/components/RequireAuth/index.tsx
export const RequireAuth: React.FC = () => {
  const [isAuthenticated, setAuthenticated] = useState(true);
  useEffect(() => {
    setAuthenticated(localStorage.getItem("access_token") !== null);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  return <Outlet />;
}
```