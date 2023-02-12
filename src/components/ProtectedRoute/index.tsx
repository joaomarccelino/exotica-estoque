import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

type ProtectedRouteProps = {
  children: JSX.Element;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const {user} = useAuth();
  console.log(Object.keys(user).length)
  return Object.keys(user).length !== 0 ? children : <Navigate to="/autenticacao" />
}

export default ProtectedRoute;