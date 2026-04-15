import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <h1 style={{ fontSize: "120px", margin: 0, color: "#ff6b6b" }}>404</h1>
      <h2 style={{ fontSize: "32px", marginTop: "10px" }}>
        Página no encontrada
      </h2>
      <p style={{ fontSize: "18px", color: "#666", marginTop: "20px" }}>
        Lo sentimos, la página que buscas no existe.
      </p>

      <Link
        to="/"
        style={{
          marginTop: "30px",
          padding: "12px 30px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Volver a Inicio
      </Link>
    </div>
  );
}
