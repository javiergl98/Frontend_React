import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { BarChart, Activity, Target, Clock } from "lucide-react";
import api from "../services/api";

export default function Estadisticas() {
  const [stats, setStats] = useState({
    totalDeportistas: 0,
    totalEntrenamientos: 0,
    distanciaTotal: 0,
    tiempoTotal: 0,
    disciplinasCount: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [deportistasRes, entrenamientosRes] = await Promise.all([
        api.get("/deportista"),
        api.get("/entrenamiento"),
      ]);

      const deportistas = deportistasRes.data || [];
      const entrenamientos = entrenamientosRes.data || [];

      const distanciaTotal = entrenamientos.reduce(
        (sum, e) => sum + (e.distancia || 0),
        0,
      );
      const tiempoTotal = entrenamientos.reduce(
        (sum, e) => sum + (e.tiempoMinutos || e.TiempoMinutos || 0),
        0,
      );

      const disciplinasCount = {};
      entrenamientos.forEach((e) => {
        const disc = e.disciplina || "Otros";
        disciplinasCount[disc] = (disciplinasCount[disc] || 0) + 1;
      });

      setStats({
        totalDeportistas: deportistas.length,
        totalEntrenamientos: entrenamientos.length,
        distanciaTotal: distanciaTotal.toFixed(2),
        tiempoTotal,
        disciplinasCount,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center py-8">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      {/* Encabezado */}
      <Box className="flex items-center gap-2">
        <BarChart className="w-8 h-8 text-blue-600" />
        <Typography variant="h4" className="font-bold text-slate-900">
          Estadísticas
        </Typography>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3}>
        {/* Total Deportistas */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover:shadow-lg transition">
            <CardContent>
              <Box className="flex items-center gap-4">
                <Box className="bg-blue-100 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="small">
                    Deportistas
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {stats.totalDeportistas}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Entrenamientos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover:shadow-lg transition">
            <CardContent>
              <Box className="flex items-center gap-4">
                <Box className="bg-green-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="small">
                    Entrenamientos
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {stats.totalEntrenamientos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distancia Total */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover:shadow-lg transition">
            <CardContent>
              <Box className="flex items-center gap-4">
                <Box className="bg-purple-100 p-3 rounded-lg">
                  <BarChart className="w-6 h-6 text-purple-600" />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="small">
                    Distancia (km)
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {stats.distanciaTotal}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tiempo Total */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover:shadow-lg transition">
            <CardContent>
              <Box className="flex items-center gap-4">
                <Box className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="small">
                    Tiempo (min)
                  </Typography>
                  <Typography variant="h5" className="font-bold">
                    {stats.tiempoTotal}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Disciplinas */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-bold mb-4">
            📊 Entrenamientos por Disciplina
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(stats.disciplinasCount).map(
              ([disciplina, count]) => (
                <Grid item xs={12} sm={6} md={3} key={disciplina}>
                  <Card variant="outlined">
                    <CardContent className="text-center">
                      <Typography variant="body2" color="textSecondary">
                        {disciplina}
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        {count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ),
            )}
          </Grid>
          {Object.keys(stats.disciplinasCount).length === 0 && (
            <Typography color="textSecondary" className="text-center py-4">
              No hay entrenamientos registrados
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Promedio */}
      {stats.totalEntrenamientos > 0 && (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography color="textSecondary" variant="small">
                  Promedio de Distancia por Entrenamiento
                </Typography>
                <Typography variant="h5" className="font-bold">
                  {(stats.distanciaTotal / stats.totalEntrenamientos).toFixed(
                    2,
                  )}{" "}
                  km
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="textSecondary" variant="small">
                  Promedio de Tiempo por Entrenamiento
                </Typography>
                <Typography variant="h5" className="font-bold">
                  {Math.round(stats.tiempoTotal / stats.totalEntrenamientos)}{" "}
                  min
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
