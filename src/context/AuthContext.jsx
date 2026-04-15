import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

// Crear contexto
const AuthContext = createContext(null);

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      console.log("✅ Sesión recuperada");
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      setUser({
        username: result.username,
        nombre: result.nombre,
        email: result.email,
      });
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, password, email, nombre) => {
    try {
      const result = await authService.register(
        username,
        password,
        email,
        nombre,
      );
      setUser({
        username: result.username,
        nombre: result.nombre,
        email: result.email,
      });
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
