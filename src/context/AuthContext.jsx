import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);