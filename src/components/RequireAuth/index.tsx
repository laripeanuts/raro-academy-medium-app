import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth: React.FC = () => {
  const [isAuthenticated, setAuthenticated] = useState(true);
  useEffect(() => {
    setAuthenticated(localStorage.getItem("access_token") !== null);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};