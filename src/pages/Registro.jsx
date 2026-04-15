import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  TextField,
  Typography,
} from "@mui/material";

export default function Registro() {
  const [formData, setFormData] = useState({
    username: "",
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.username ||
      !formData.nombre ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("⚠️ Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("❌ La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("❌ Email inválido");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Intentando registro con usuario:", formData.username);
      await register(
        formData.username,
        formData.password,
        formData.email,
        formData.nombre,
      );
      setSuccess(true);
      console.log("✅ Registro exitoso, redirigiendo...");
      setTimeout(() => {
        navigate("/deportistas");
      }, 1400);
    } catch (err) {
      console.error("❌ Error en registro:", err);
      setError(
        err.response?.data?.message ||
          "❌ Error al registrar. Intenta con otro usuario o email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardContent className="space-y-6 p-8">
          <Typography
            variant="h4"
            component="h1"
            className="text-slate-900 text-center font-semibold"
          >
            📝 Crear Cuenta
          </Typography>

          {success && (
            <Alert severity="success">Registro exitoso. Redirigiendo...</Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? "⏳ Registrando..." : "Crear cuenta"}
            </Button>
          </Box>

          <Typography variant="body2" className="text-center text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Inicia sesión
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
