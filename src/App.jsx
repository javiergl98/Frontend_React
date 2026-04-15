import { Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DebugPanel from "./components/DebugPanel";

// Páginas Públicas
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// Páginas Privadas
import Deportistas from "./pages/Deportistas";
import Entrenamientos from "./pages/Entrenamientos";
import Estadisticas from "./pages/Estadisticas";

// Página 404
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Privadas */}
          <Route
            path="/deportistas"
            element={
              <ProtectedRoute>
                <Deportistas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entrenamientos"
            element={
              <ProtectedRoute>
                <Entrenamientos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estadisticas"
            element={
              <ProtectedRoute>
                <Estadisticas />
              </ProtectedRoute>
            }
          />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}

export default App;
