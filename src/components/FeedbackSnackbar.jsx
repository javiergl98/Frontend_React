import { Snackbar, Alert } from "@mui/material";

export default function FeedbackSnackbar({
  open,
  message,
  severity = "success", // 'success', 'error', 'warning', 'info'
  onClose,
  autoHideDuration = 4000,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
