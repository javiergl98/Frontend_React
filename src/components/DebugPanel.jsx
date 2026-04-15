import { useState, useEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";

export default function DebugPanel() {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Leer logs cada segundo
    const interval = setInterval(() => {
      const debugLogs = JSON.parse(localStorage.getItem("debugLogs") || "[]");
      setLogs(debugLogs);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Button
          variant="contained"
          color="warning"
          onClick={() => setIsOpen(true)}
          sx={{ borderRadius: "50%", width: 60, height: 60, fontSize: "20px" }}
        >
          🐛
        </Button>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 400,
        maxHeight: 500,
        overflow: "auto",
        zIndex: 9999,
        p: 2,
        backgroundColor: "#1e1e1e",
        border: "2px solid #ff6b6b",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
          🐛 Debug Logs
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            localStorage.setItem("debugLogs", "[]");
            setLogs([]);
          }}
          sx={{ color: "#fff" }}
        >
          Limpiar
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsOpen(false)}
          sx={{ color: "#fff" }}
        >
          ✕
        </Button>
      </Box>

      <Box sx={{ maxHeight: 450, overflow: "auto" }}>
        {logs.length === 0 ? (
          <Typography sx={{ color: "#888" }}>No hay logs...</Typography>
        ) : (
          logs.map((log, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 1,
                p: 1,
                backgroundColor: log.message.includes("❌")
                  ? "#3d2626"
                  : "#263238",
                border: `1px solid ${log.message.includes("❌") ? "#ff6b6b" : "#424242"}`,
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            >
              <Typography sx={{ color: "#aaa", fontSize: "11px" }}>
                {log.timestamp}
              </Typography>
              <Typography
                sx={{
                  color: log.message.includes("❌")
                    ? "#ff6b6b"
                    : log.message.includes("✅")
                      ? "#69f0ae"
                      : "#81d4fa",
                  fontSize: "12px",
                  wordBreak: "break-all",
                }}
              >
                {log.message}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}
