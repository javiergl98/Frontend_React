import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { AlertCircle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  danger = true,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle className="flex items-center gap-2 font-semibold text-slate-900">
        {danger && <AlertCircle className="w-5 h-5 text-red-500" />}
        {title}
      </DialogTitle>

      <DialogContent className="py-6">
        <Typography className="text-slate-700">{message}</Typography>
      </DialogContent>

      <DialogActions className="p-4 gap-2">
        <Button onClick={onCancel} disabled={loading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={danger ? "error" : "primary"}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
