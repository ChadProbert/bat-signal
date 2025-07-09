import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  expiresAt: number | null;

  // Functions that manage the auth state throughout the app (defined in AuthProvider.tsx)
  saveToken: (token: string, expiresIn?: number) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
