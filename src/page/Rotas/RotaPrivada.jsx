import { Navigate } from "react-router-dom";

export function RotaPrivada({ usuario, tipoPermitido, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.tipo !== tipoPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}
