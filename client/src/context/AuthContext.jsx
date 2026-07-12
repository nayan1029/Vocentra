import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("vocentra_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vocentra_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((u) => {
        setUser(u);
        localStorage.setItem("vocentra_user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("vocentra_token");
        localStorage.removeItem("vocentra_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("vocentra_token", data.token);
    localStorage.setItem("vocentra_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem("vocentra_token", data.token);
    localStorage.setItem("vocentra_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("vocentra_token");
    localStorage.removeItem("vocentra_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
