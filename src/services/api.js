import axios from "axios";

// URL base de la API
export const API_BASE_URL = "http://localhost:8080";

// Sistema de logging persistente
const addLog = (message) => {
  const logs = JSON.parse(localStorage.getItem("debugLogs") || "[]");
  logs.push({
    timestamp: new Date().toLocaleTimeString(),
    message,
  });
  // Mantener últimos 50 logs
  if (logs.length > 50) logs.shift();
  localStorage.setItem("debugLogs", JSON.stringify(logs));
};

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0, // ← NO seguir redirecciones automáticamente
});

// Interceptor: Agregar token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const msg = `📡 [REQUEST] ${config.method.toUpperCase()} ${config.url}`;
    console.log(msg);
    addLog(msg);

    console.log(
      "🔐 Token:",
      token ? token.substring(0, 20) + "..." : "NO TOKEN",
    );
    addLog(`🔐 Token: ${token ? token.substring(0, 20) + "..." : "NO TOKEN"}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR]", error.message);
    addLog(`❌ [REQUEST ERROR] ${error.message}`);
    return Promise.reject(error);
  },
);

// Interceptor: Manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    const msg = `✅ [RESPONSE] ${response.status} ${response.config.url}`;
    console.log(msg);
    addLog(msg);
    return response;
  },
  (error) => {
    console.error("❌ [ERROR RESPONSE]");
    console.error("URL:", error.config?.url);
    console.error("Método:", error.config?.method?.toUpperCase());
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Message:", error.message);

    // Guardar logs
    addLog(
      `❌ [ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`,
    );
    addLog(`Error Message: ${error.message}`);
    if (error.response?.data) {
      addLog(`Response Data: ${JSON.stringify(error.response.data)}`);
    }

    // Información específica para 302
    if (error.response?.status === 302) {
      const locationHeader = error.response?.headers?.location;
      const msg = `🔄 [REDIRECCIÓN 302] Redirige a: ${locationHeader}`;
      console.error(msg);
      addLog(msg);
      console.error("⚠️ El backend está intentando redirigir.");
      console.error(
        "Posible causa: Token JWT no válido o Spring Security requiere redirección",
      );
    }

    // NO hacer redirect automático - dejar que el componente lo maneje
    if (error.response?.status === 401) {
      const msg = "❌ Token inválido o expirado";
      console.error(msg);
      addLog(msg);
      // NO hacer localStorage.removeItem aquí - dejar que lo maneje AuthContext
    }
    return Promise.reject(error);
  },
);

export default api;
