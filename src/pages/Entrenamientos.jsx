import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Plus, Edit2, Trash2 } from "lucide-react";
import CRUDModal from "../components/CRUDModal";
import ConfirmDialog from "../components/ConfirmDialog";
import FeedbackSnackbar from "../components/FeedbackSnackbar";
import api from "../services/api";

const DISCIPLINAS = [
  "Running",
  "Ciclismo",
  "Natación",
  "Triatlón",
  "Gym",
  "Otro",
];

export default function Entrenamientos() {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [deportistas, setDeportistas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    deportistaId: "",
    fecha: new Date().toISOString().split("T")[0],
    distancia: "",
    tiempoMinutos: "",
    disciplina: "Running",
  });

  // Cargar datos al montar
  useEffect(() => {
    fetchDeportistas();
    fetchEntrenamientos();
  }, []);

  const fetchDeportistas = async () => {
    try {
      const response = await api.get("/deportista");
      setDeportistas(response.data || []);
    } catch (error) {
      showSnackbar("❌ Error al cargar deportistas", "error");
      console.error(error);
    }
  };

  const fetchEntrenamientos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/entrenamiento");
      setEntrenamientos(response.data || []);
    } catch (error) {
      showSnackbar("❌ Error al cargar entrenamientos", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenModalNew = () => {
    setEditingId(null);
    setFormData({
      deportistaId: "",
      fecha: new Date().toISOString().split("T")[0],
      distancia: "",
      tiempoMinutos: "",
      disciplina: "Running",
    });
    setOpenModal(true);
  };

  const handleOpenModalEdit = (entrenamiento) => {
    setEditingId(entrenamiento.id);
    setFormData({
      deportistaId: entrenamiento.deportistaId || "",
      fecha: entrenamiento.fecha || new Date().toISOString().split("T")[0],
      distancia: entrenamiento.distancia || "",
      tiempoMinutos:
        entrenamiento.tiempoMinutos || entrenamiento.TiempoMinutos || "",
      disciplina: entrenamiento.disciplina || "Running",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      deportistaId: "",
      fecha: new Date().toISOString().split("T")[0],
      distancia: "",
      tiempoMinutos: "",
      disciplina: "Running",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidate = () => {
    if (!formData.deportistaId.trim()) {
      showSnackbar("Debes seleccionar un deportista", "warning");
      return false;
    }
    if (!formData.fecha) {
      showSnackbar("La fecha es requerida", "warning");
      return false;
    }
    if (!formData.distancia || formData.distancia <= 0) {
      showSnackbar("La distancia debe ser mayor a 0", "warning");
      return false;
    }
    if (!formData.tiempoMinutos || formData.tiempoMinutos <= 0) {
      showSnackbar("El tiempo debe ser mayor a 0", "warning");
      return false;
    }
    return true;
  };

  const handleSubmitModal = async () => {
    if (!handleValidate()) return;

    try {
      setLoading(true);
      const data = {
        deportistaId: formData.deportistaId,
        fecha: formData.fecha,
        distancia: parseFloat(formData.distancia),
        tiempoMinutos: parseInt(formData.tiempoMinutos),
        disciplina: formData.disciplina,
      };

      if (editingId) {
        await api.put(`/entrenamiento/${editingId}`, data);
        showSnackbar("✅ Entrenamiento actualizado");
      } else {
        await api.post("/entrenamiento", data);
        showSnackbar("✅ Entrenamiento creado");
      }
      handleCloseModal();
      fetchEntrenamientos();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "❌ Error al guardar",
        "error",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmDelete = (id, disciplina) => {
    setDeleteId({ id, disciplina });
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/entrenamiento/${deleteId.id}`);
      setOpenConfirm(false);
      showSnackbar("✅ Entrenamiento eliminado");
      fetchEntrenamientos();
    } catch (error) {
      showSnackbar("❌ Error al eliminar", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDisciplinaIcon = (disciplina) => {
    switch (disciplina) {
      case "Running":
        return "🏃";
      case "Ciclismo":
        return "🚴";
      case "Natación":
        return "🏊";
      case "Triatlón":
        return "🏅";
      case "Gym":
        return "🏋️";
      default:
        return "💪";
    }
  };

  return (
    <Box className="space-y-6">
      {/* Encabezado */}
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="font-bold text-slate-900">
          🏃 Entrenamientos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus className="w-5 h-5" />}
          onClick={handleOpenModalNew}
          disabled={loading || deportistas.length === 0}
        >
          Nuevo Entrenamiento
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        {loading && entrenamientos.length === 0 ? (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        ) : deportistas.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography className="text-slate-500">
              No hay deportistas registrados. Crea uno primero en Deportistas.
            </Typography>
          </Box>
        ) : entrenamientos.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography className="text-slate-500">
              No hay entrenamientos registrados. ¡Crea uno para empezar!
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead className="bg-slate-100">
              <TableRow>
                <TableCell className="font-semibold">Disciplina</TableCell>
                <TableCell>Deportista</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="center">Distancia (km)</TableCell>
                <TableCell align="center">Tiempo (min)</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entrenamientos.map((entrenamiento) => {
                const deportista = deportistas.find(
                  (d) => d.id === entrenamiento.deportistaId,
                );
                const disciplina =
                  typeof entrenamiento.disciplina === "string"
                    ? entrenamiento.disciplina
                    : entrenamiento.disciplina?.nombre || "Otros";
                return (
                  <TableRow key={entrenamiento.id} hover>
                    <TableCell className="font-medium">
                      {getDisciplinaIcon(disciplina)} {disciplina}
                    </TableCell>
                    <TableCell>
                      {deportista?.nombre || "Sin deportista"}
                    </TableCell>
                    <TableCell>
                      {new Date(entrenamiento.fecha).toLocaleDateString(
                        "es-ES",
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {entrenamiento.distancia}
                    </TableCell>
                    <TableCell align="center">
                      {entrenamiento.tiempoMinutos ||
                        entrenamiento.TiempoMinutos}
                    </TableCell>
                    <TableCell align="center" className="space-x-2">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit2 className="w-4 h-4" />}
                        onClick={() => handleOpenModalEdit(entrenamiento)}
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 className="w-4 h-4" />}
                        onClick={() =>
                          handleOpenConfirmDelete(
                            entrenamiento.id,
                            entrenamiento.disciplina,
                          )
                        }
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Modal Crear/Editar */}
      <CRUDModal
        open={openModal}
        title={editingId ? "Editar Entrenamiento" : "Nuevo Entrenamiento"}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        loading={loading}
      >
        <Box className="space-y-4">
          <TextField
            label="Deportista"
            name="deportistaId"
            value={formData.deportistaId}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
            select
          >
            {deportistas.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.nombre} ({d.email})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Distancia (km)"
            name="distancia"
            type="number"
            inputProps={{ step: 0.1, min: 0 }}
            value={formData.distancia}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Tiempo (minutos)"
            name="tiempoMinutos"
            type="number"
            inputProps={{ min: 0 }}
            value={formData.tiempoMinutos}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Disciplina"
            name="disciplina"
            value={formData.disciplina}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
            select
          >
            {DISCIPLINAS.map((d) => (
              <MenuItem key={d} value={d}>
                {getDisciplinaIcon(d)} {d}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </CRUDModal>

      {/* Dialog Confirmación Eliminar */}
      <ConfirmDialog
        open={openConfirm}
        title="Eliminar Entrenamiento"
        message={`¿Estás seguro de que deseas eliminar este entrenamiento de ${deleteId?.disciplina}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
        loading={loading}
        confirmText="Eliminar"
      />

      {/* Snackbar Feedback */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
