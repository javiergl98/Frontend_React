import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Edit2, Trash2, Plus } from "lucide-react";
import api from "../services/api";
import CRUDModal from "../components/CRUDModal";
import ConfirmDialog from "../components/ConfirmDialog";
import FeedbackSnackbar from "../components/FeedbackSnackbar";

export default function Deportistas() {
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
    nombre: "",
    email: "",
    edad: "",
  });

  // Cargar deportistas al montar
  useEffect(() => {
    fetchDeportistas();
  }, []);

  const fetchDeportistas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/deportista");
      setDeportistas(response.data || []);
    } catch (error) {
      showSnackbar("❌ Error al cargar deportistas", "error");
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
    setFormData({ nombre: "", email: "", edad: "" });
    setOpenModal(true);
  };

  const handleOpenModalEdit = (deportista) => {
    setEditingId(deportista.id);
    setFormData({
      nombre: deportista.nombre || "",
      email: deportista.email || "",
      edad: deportista.edad || "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ nombre: "", email: "", edad: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidate = () => {
    if (!formData.nombre.trim()) {
      showSnackbar("El nombre es requerido", "warning");
      return false;
    }
    if (!formData.email.trim()) {
      showSnackbar("El email es requerido", "warning");
      return false;
    }
    if (!formData.email.includes("@")) {
      showSnackbar("Email inválido", "warning");
      return false;
    }
    if (!formData.edad || formData.edad < 1 || formData.edad > 120) {
      showSnackbar("La edad debe estar entre 1 y 120", "warning");
      return false;
    }
    return true;
  };

  const handleSubmitModal = async () => {
    if (!handleValidate()) return;

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/deportista/${editingId}`, formData);
        showSnackbar("✅ Deportista actualizado");
      } else {
        await api.post("/deportista", formData);
        showSnackbar("✅ Deportista creado");
      }
      handleCloseModal();
      fetchDeportistas();
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

  const handleOpenConfirmDelete = (id, nombre) => {
    setDeleteId({ id, nombre });
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/deportista/${deleteId.id}`);
      setOpenConfirm(false);
      showSnackbar("✅ Deportista eliminado");
      fetchDeportistas();
    } catch (error) {
      showSnackbar("❌ Error al eliminar", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="space-y-6">
      {/* Encabezado */}
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="font-bold text-slate-900">
          👥 Deportistas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus className="w-5 h-5" />}
          onClick={handleOpenModalNew}
          disabled={loading}
        >
          Nuevo Deportista
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        {loading && deportistas.length === 0 ? (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        ) : deportistas.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography className="text-slate-500">
              No hay deportistas registrados. ¡Crea uno para empezar!
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead className="bg-slate-100">
              <TableRow>
                <TableCell className="font-semibold">Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Edad</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deportistas.map((deportista) => (
                <TableRow key={deportista.id} hover>
                  <TableCell className="font-medium">
                    {deportista.nombre}
                  </TableCell>
                  <TableCell>{deportista.email}</TableCell>
                  <TableCell align="center">{deportista.edad}</TableCell>
                  <TableCell align="center" className="space-x-2">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit2 className="w-4 h-4" />}
                      onClick={() => handleOpenModalEdit(deportista)}
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
                          deportista.id,
                          deportista.nombre,
                        )
                      }
                      disabled={loading}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Modal Crear/Editar */}
      <CRUDModal
        open={openModal}
        title={editingId ? "Editar Deportista" : "Nuevo Deportista"}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        loading={loading}
      >
        <Box className="space-y-4">
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
            autoFocus
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Edad"
            name="edad"
            type="number"
            inputProps={{ min: 1, max: 120 }}
            value={formData.edad}
            onChange={handleFormChange}
            fullWidth
            disabled={loading}
          />
        </Box>
      </CRUDModal>

      {/* Dialog Confirmación Eliminar */}
      <ConfirmDialog
        open={openConfirm}
        title="Eliminar Deportista"
        message={`¿Estás seguro de que deseas eliminar a ${deleteId?.nombre}? Esta acción no se puede deshacer.`}
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
