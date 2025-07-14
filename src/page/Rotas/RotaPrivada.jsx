import { Navigate } from "react-router-dom";

export function RotaPrivada({ children, usuario }) {
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  return children;
}
