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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("⚠️ Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Intentando login con usuario:", username);
      await login(username, password);
      console.log("✅ Login exitoso, redirigiendo...");
      navigate("/deportistas");
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(
        err.response?.data?.message || "❌ Usuario o contraseña incorrectos",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <Typography
            variant="h4"
            component="h1"
            className="text-slate-900 text-center font-semibold"
          >
            🔐 Iniciar Sesión
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} className="space-y-4">
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              fullWidth
              disabled={loading}
              autoComplete="username"
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              fullWidth
              disabled={loading}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? "⏳ Ingresando..." : "Ingresar"}
            </Button>
          </Box>

          <Typography variant="body2" className="text-center text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link component={RouterLink} to="/registro" underline="hover">
              Regístrate aquí
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
