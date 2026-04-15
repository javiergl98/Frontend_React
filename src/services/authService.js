import api, { API_BASE_URL } from "./api";

// API de Autenticación
export const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      const { token, username: user, nombre, email } = response.data;

      // Guardar en localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: user, nombre, email }),
      );

      console.log("✅ Login exitoso:", user);
      return { token, username: user, nombre, email };
    } catch (error) {
      console.error(
        "❌ Error en login:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Register
  register: async (username, password, email, nombre) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        password,
        email,
        nombre,
      });
      const {
        token,
        username: user,
        email: userEmail,
        nombre: userNombre,
      } = response.data;

      // Guardar en localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user,
          nombre: userNombre,
          email: userEmail,
        }),
      );

      console.log("✅ Registro exitoso:", user);
      return { token, username: user, nombre: userNombre, email: userEmail };
    } catch (error) {
      console.error(
        "❌ Error en registro:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    console.log("✅ Logout exitoso");
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo usuario:", error);
      throw error;
    }
  },

  // Verificar si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem("authToken");
  },
};

// API de Deportistas
export const deportistaService = {
  // Obtener todos los deportistas
  getAll: async () => {
    try {
      console.log("🚀 [Deportista] Llamando GET /deportista");
      console.log("📍 URL completa:", API_BASE_URL + "/deportista");
      const token = localStorage.getItem("authToken");
      console.log("🔑 Token existe:", !!token);

      const response = await api.get("/deportista");
      console.log("✅ [Deportista] Respuesta GET /deportista:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Deportista] Error GET /deportista:");
      console.error("  - URL:", API_BASE_URL + "/deportista");
      console.error("  - Status:", error.response?.status);
      console.error("  - Status Text:", error.response?.statusText);
      console.error("  - Error:", error.response?.data || error.message);

      if (
        error.response?.status === 302 &&
        Array.isArray(error.response?.data)
      ) {
        console.warn(
          "⚠️ [Deportista] Recibiendo 302 pero con datos. Usando fallback de respuesta.",
        );
        return error.response.data;
      }

      throw error;
    }
  },

  // Obtener deportista por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/deportista/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo deportista:", error);
      throw error;
    }
  },

  // Crear nuevo deportista
  create: async (deportista) => {
    try {
      const response = await api.post("/deportista", deportista);
      console.log("✅ Deportista creado:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creando deportista:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Actualizar deportista
  update: async (id, deportista) => {
    try {
      const response = await api.put(`/deportista/${id}`, deportista);
      return response.data;
    } catch (error) {
      console.error("❌ Error actualizando deportista:", error);
      throw error;
    }
  },

  // Eliminar deportista
  delete: async (id) => {
    try {
      await api.delete(`/deportista/${id}`);
      console.log("✅ Deportista eliminado");
    } catch (error) {
      console.error("❌ Error eliminando deportista:", error);
      throw error;
    }
  },
};

// API de Entrenamientos
export const entrenamientoService = {
  // Obtener todos los entrenamientos
  getAll: async () => {
    try {
      const response = await api.get("/entrenamiento");
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo entrenamientos:", error);
      throw error;
    }
  },

  // Obtener entrenamientos de un deportista
  getByDeportista: async (deportistaId) => {
    try {
      const response = await api.get(
        `/entrenamiento/deportista/${deportistaId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error obteniendo entrenamientos del deportista:",
        error,
      );
      throw error;
    }
  },

  // Obtener un entrenamiento por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/entrenamiento/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo entrenamiento:", error);
      throw error;
    }
  },

  // Crear nuevo entrenamiento
  create: async (entrenamiento) => {
    try {
      console.log("📤 Enviando entrenamiento:", entrenamiento);
      const response = await api.post("/entrenamiento", entrenamiento);
      console.log("✅ Entrenamiento creado:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error creando entrenamiento:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // Actualizar entrenamiento
  update: async (id, entrenamiento) => {
    try {
      const response = await api.put(`/entrenamiento/${id}`, entrenamiento);
      return response.data;
    } catch (error) {
      console.error("❌ Error actualizando entrenamiento:", error);
      throw error;
    }
  },

  // Eliminar entrenamiento
  delete: async (id) => {
    try {
      await api.delete(`/entrenamiento/${id}`);
      console.log("✅ Entrenamiento eliminado");
    } catch (error) {
      console.error("❌ Error eliminando entrenamiento:", error);
      throw error;
    }
  },

  // Subir imagen de portada
  uploadPortada: async (entrenamientoId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `/entrenamiento/${entrenamientoId}/portada`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("✅ Imagen subida:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error subiendo imagen:", error);
      throw error;
    }
  },

  // Obtener imagen de portada
  getPortada: (entrenamientoId) => {
    return `${API_BASE_URL}/entrenamiento/${entrenamientoId}/portada`;
  },

  // Exportar a JSON
  exportJSON: async () => {
    try {
      const response = await api.get("/entrenamiento/export/json");
      return response.data;
    } catch (error) {
      console.error("❌ Error exportando JSON:", error);
      throw error;
    }
  },

  // Importar desde JSON
  importJSON: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/entrenamiento/import/json", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ JSON importado:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error importando JSON:", error);
      throw error;
    }
  },
};
