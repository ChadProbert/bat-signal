import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Ensures that the user is authenticated before accessing the route
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, expiresAt, clearToken } = useContext(AuthContext)!;

  // Redirects to login if the user is not authenticated or if the token has expired
  if (!token || (expiresAt && Date.now() > expiresAt)) {
    // If token is expired, clear it to avoid stale data causing redirect loops
    if (token) {
      clearToken();
    }
    return <Navigate to="/" replace />;
  }

  // Renders the protected route if the user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;