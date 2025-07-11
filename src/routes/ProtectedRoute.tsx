import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Ensures that the user is authenticated before accessing the route
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, expiresAt, clearToken } = useContext(AuthContext)!;

  // Auth is invalid if the token is null or the token has expired
  const invalidAuth = !token || (expiresAt !== null && Date.now() > expiresAt)

  useEffect(() => {
    if (invalidAuth) {
      clearToken()
    }
  }, [invalidAuth, clearToken])

  if (invalidAuth) {
    return <Navigate to="/" replace />;
  }

  // Renders the protected route if the user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;