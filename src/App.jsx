import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [filtroDistancia, setFiltroDistancia] = useState(false);
  
  // URL de Spring Boot
  const API_URL = "http://localhost:8080/entrenamiento";

  // Cargar datos al iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setEntrenamientos(data))
      .catch(err => console.error("Error: ¿Está encendida la API de Java?", err));
  }, []);

  // Función para borrar (DELETE)
  const borrar = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) setEntrenamientos(entrenamientos.filter(e => e.id !== id));
      });
  };

  // Función para ordenar por distancia
  const ordenar = (modo) => {
    const copia = [...entrenamientos].sort((a, b) => 
      modo === 'asc' ? a.distancia - b.distancia : b.distancia - a.distancia
    );
    setEntrenamientos(copia);
  };

  const listaMostrar = filtroDistancia 
    ? entrenamientos.filter(e => e.distancia > 5) 
    : entrenamientos;

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <h1>🏃 Gestión de Entrenamientos</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => ordenar('asc')}>Ordenar Distancia ↑</button>
        <button onClick={() => ordenar('desc')}>Ordenar Distancia ↓</button>
        <button onClick={() => setFiltroDistancia(!filtroDistancia)}>
          {filtroDistancia ? "Ver Todos" : "Ver solo > 5km"}
        </button>
      </div>

      <div className="card">
        {entrenamientos.length === 0 ? (
          <p>Cargando datos... (Revisa que IntelliJ esté en Play)</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {listaMostrar.map(e => (
              <li key={e.id} style={{ borderBottom: '1px solid #444', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
               <span>
  {/* Lógica de iconos profesional */}
  {e.disciplina?.nombre === 'Running' && '🏃'}
  {e.disciplina?.nombre === 'Ciclismo' && '🚴'}
  {e.disciplina?.nombre === 'Natación' && '🏊'}
  {/* Icono por defecto si no es ninguno de los anteriores */}
  {!['Running', 'Ciclismo', 'Natación'].includes(e.disciplina?.nombre) && '🏋️'}
  
  <strong style={{ marginLeft: '8px' }}> {e.disciplina?.nombre}</strong> - {e.distancia}km
</span>
                <button onClick={() => borrar(e.id)} style={{backgroundColor: 'red', color: 'white'}}>Borrar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App