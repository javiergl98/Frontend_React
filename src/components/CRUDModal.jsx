import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";

export default function CRUDModal({
  open,
  title,
  onClose,
  onSubmit,
  loading,
  children,
  submitButtonText = "Guardar",
  cancelButtonText = "Cancelar",
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-semibold text-slate-900">
        {title}
      </DialogTitle>

      <DialogContent className="py-6">
        {loading ? (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={loading}>
          {cancelButtonText}
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
