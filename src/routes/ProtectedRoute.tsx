import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Ensures that the user is authenticated before accessing the route
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, expiresAt } = useContext(AuthContext)!;

  // Redirects to login if the user is not authenticated or if the token has expired
  if (!token || Date.now() > expiresAt!) {
    return <Navigate to="/" replace />;
  }

  // Renders the protected route if the user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;