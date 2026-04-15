import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static" className="bg-slate-900 shadow-lg">
      <Toolbar className="flex flex-wrap gap-3 justify-between px-4 py-3 sm:px-6">
        <Box
          component={RouterLink}
          to="/"
          className="flex items-center gap-3 no-underline text-white"
        >
          <Typography variant="h6" component="span" className="font-bold">
            🏃 TrainHub
          </Typography>
        </Box>

        <Box className="flex flex-wrap items-center gap-2">
          <Button component={RouterLink} to="/" color="inherit" size="small">
            Inicio
          </Button>

          {!isAuthenticated ? (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                size="small"
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/registro"
                color="inherit"
                size="small"
              >
                Registro
              </Button>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/deportistas"
                color="inherit"
                size="small"
              >
                Deportistas
              </Button>
              <Button
                component={RouterLink}
                to="/entrenamientos"
                color="inherit"
                size="small"
              >
                Entrenamientos
              </Button>
              <Button
                component={RouterLink}
                to="/estadisticas"
                color="inherit"
                size="small"
              >
                Estadísticas
              </Button>
              <Typography variant="body2" className="text-slate-200 px-2">
                👤 {user?.nombre || user?.username}
              </Typography>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                size="small"
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
