import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("predictx_token"));
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.data);
      } catch {
        // Token invalid — clear it
        localStorage.removeItem("predictx_token");
        localStorage.removeItem("predictx_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  /**
   * Register a new user.
   */
  const register = useCallback(async (name, email, password) => {
    const res = await api.post("/api/auth/register", { name, email, password });
    const data = res.data.data;

    setToken(data.token);
    setUser(data);
    localStorage.setItem("predictx_token", data.token);
    localStorage.setItem("predictx_user", JSON.stringify(data));

    return data;
  }, []);

  /**
   * Log in an existing user.
   */
  const login = useCallback(async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    const data = res.data.data;

    setToken(data.token);
    setUser(data);
    localStorage.setItem("predictx_token", data.token);
    localStorage.setItem("predictx_user", JSON.stringify(data));

    return data;
  }, []);

  /**
   * Log out.
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("predictx_token");
    localStorage.removeItem("predictx_user");
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
