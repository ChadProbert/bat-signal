import { useState } from "react";
import type { ReactNode } from "react";
import AuthContext from "./AuthContext";

// Manages the authentication state of the user throughout the app
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem("bat_signal_token"));
  const [expiresAt, setExpiresAt] = useState(() => parseInt(localStorage.getItem("bat_token_expires_at") || "0", 10));

  // Saves the token and token expiry time (1 hour) in state and localstorage
  const saveToken = (newToken: string, expiresIn?: number) => {
    setToken(newToken);
    setExpiresAt(Date.now() + expiresIn! * 1000);
    localStorage.setItem("bat_signal_token", newToken);
    localStorage.setItem("bat_token_expires_at", (Date.now() + expiresIn! * 1000).toString());
  };

  // Clears the token from state and localstorage
  const clearToken = () => {
    setToken(null);
    localStorage.removeItem("bat_signal_token");
    localStorage.removeItem("bat_token_expires_at");
  };

  return (
    // Serves the authentication state and auth functions to the entire app
    <AuthContext.Provider value={{ token, saveToken, clearToken, expiresAt }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
