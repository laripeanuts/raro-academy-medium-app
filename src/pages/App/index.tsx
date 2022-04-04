import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { LoginPage } from "../../pages/Login";
import { NotFoundPage } from "../../pages/NotFound";
import { ArticlesPage } from "../../pages/Articles";
import { ArticlePage } from "../../pages/Article";
import { MyArticlesPage } from "../../pages/MyArticles";
import { EditFilePage } from "../../pages/EditFile";
import { NewUser } from "../../pages/NewUser";
import { RequireAuth } from "../../components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/newUser" element={<NewUser />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />

          <Route element={<RequireAuth />}>
            <Route path="/my-articles" element={<MyArticlesPage />} />
            <Route path="/articles/edit/:id" element={<EditFilePage />} />
            <Route path="/articles/new" element={<EditFilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
