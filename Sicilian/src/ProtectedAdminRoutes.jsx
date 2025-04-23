import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";

export const ProtectedAdminRoutes = () => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) return null;

  return user && user.user_admin === 1 ? <Outlet /> : <Navigate to="/" />;
};
