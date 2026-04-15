---
title: "Gestión Deportiva - Frontend React"
lastUpdated: "15/04/2026 - v1.0"
version: "1.0"
---

# 🤖 AGENTS.md - Contexto Completo Frontend

**Proyecto**: Sistema web gestión deportistas + entrenamientos  
**Frontend**: React 19 + Vite + Material UI 5 + Tailwind + Axios JWT  
**Backend**: Spring Boot 4 + MongoDB  
**Status**: ✅ CRUD completo funcional

---

## 🎯 Stack Tecnológico

| Tecnología   | Versión | Propósito                       |
| ------------ | ------- | ------------------------------- |
| React        | 19.2.4  | UI framework                    |
| Vite         | 8.0.8   | Dev server + bundler            |
| Material UI  | 5.18.0  | Componentes UI profesionales    |
| Axios        | 1.15.0  | HTTP client con JWT interceptor |
| React Router | 7.14.1  | Client-side routing             |
| Tailwind CSS | 3.4.4   | Utility-first CSS               |
| Lucide React | 0.x     | SVG icons                       |

**Puertos**: Frontend `:5173` | Backend `:8080`

---

## 📁 Estructura Archivos Clave

```
src/
├── main.jsx                     # App root + AuthProvider
├── App.jsx                      # Router (6 rutas)
├── context/
│   └── AuthContext.jsx          # Estado global: JWT + usuario
├── pages/
│   ├── Login.jsx                # POST /auth/login
│   ├── Registro.jsx             # POST /auth/register
│   ├── Deportistas.jsx          # CRUD tabla + modal
│   ├── Entrenamientos.jsx       # CRUD tabla + relación deportistas
│   ├── Estadisticas.jsx         # Dashboard KPIs
│   ├── Home.jsx                 # Landing page
│   └── NotFound.jsx             # 404
├── components/
│   ├── CRUDModal.jsx            # Modal create/edit (reutilizable)
│   ├── ConfirmDialog.jsx        # Confirmación pre-delete
│   ├── FeedbackSnackbar.jsx     # Notificaciones success/error
│   └── DebugPanel.jsx           # Logger flotante localStorage
└── services/
    └── api.js                   # Axios + JWT interceptor + logging
```

---

## 🗺️ Rutas (React Router)

| Ruta              | Público | Componente         | Función             |
| ----------------- | ------- | ------------------ | ------------------- |
| `/`               | ✅      | Home.jsx           | Landing page        |
| `/login`          | ✅      | Login.jsx          | POST /auth/login    |
| `/registro`       | ✅      | Registro.jsx       | POST /auth/register |
| `/deportistas`    | ❌      | Deportistas.jsx    | CRUD atletas        |
| `/entrenamientos` | ❌      | Entrenamientos.jsx | CRUD entrenamientos |
| `/estadisticas`   | ❌      | Estadisticas.jsx   | Dashboard           |
| `*`               | ✅      | NotFound.jsx       | 404 fallback        |

Rutas protegidas: redirigen a `/login` si no hay JWT en localStorage

---

## 🔐 Autenticación JWT

**Flujo**:

1. POST `/auth/register` u `/auth/login`
2. Backend retorna `{ token, username, email, nombre }`
3. Token → localStorage + AuthContext
4. Axios interceptor agrega `Authorization: Bearer {token}` automáticamente
5. 401 → logout sin redirect, snackbar muestra error

**Puertos compatibles**: Axios interceptor detecta rutas públicas y NO agrega token

---

## 📊 Páginas Principales

### Deportistas

- **Tabla**: Nombre, Email, Edad, [Editar] [Eliminar]
- **Modal Nuevo**: TextField nombre, email, edad + validaciones
- **Modal Editar**: Pre-llenado + PUT
- **Confirmación**: ConfirmDialog pre-delete
- **Feedback**: Snackbar éxito/error

### Entrenamientos

- **Tabla**: Disciplina 🏃, Deportista, Fecha, Distancia (km), Tiempo (min), [Editar] [Eliminar]
- **Modal con Selects**: Deportista, Disciplina (Running 🏃 | Ciclismo 🚴 | Natación 🏊 | Triatlón 🏅 | Gym 🏋️ | Otro 💪)
- **DatePicker**: Fecha
- **Validaciones**: Campos requeridos, valores > 0
- **Relación**: Vinculado a deportista

### Estadísticas

- **4 KPIs**: Total deportistas, entrenamientos, distancia total, tiempo total
- **Desglose**: Entrenamientos por disciplina
- **Promedios**: Distancia/tiempo promedio por entrenamiento

---

## 🎨 Componentes Reutilizables

### CRUDModal.jsx

```jsx
<CRUDModal
  open={isOpen}
  title="Crear/Editar"
  onClose={handleClose}
  onSubmit={handleSubmit}
  loading={isSaving}
>
  <TextField label="Nombre" value={form.nombre} onChange={...} />
</CRUDModal>
```

Props: open, title, onClose, onSubmit, loading, children (form)  
Renderiza: Dialog Material UI + CircularProgress mientras loading

### ConfirmDialog.jsx

```jsx
<ConfirmDialog
  open={isConfirming}
  title="Confirmar?"
  message="¿Eliminar recurso?"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

Props: open, title, message, onConfirm, onCancel, loading, danger  
Renderiza: Dialog Material UI + AlertCircle icon + botón rojo si danger

### FeedbackSnackbar.jsx

```jsx
<FeedbackSnackbar
  open={snackbar.open}
  message="✅ Guardado"
  severity="success"
  onClose={handleClose}
/>
```

Props: open, message, severity ("success"|"error"|"warning"|"info"), onClose  
Auto-hide: 4 segundos | Posición: bottom-right

### DebugPanel.jsx

- Botón 🐛 flotante bottom-right fixed
- Expandible → últimos 50 logs localStorage
- Colores: ❌ error (rojo), ✅ success (verde), 📡 request (azul)
- Botón "Limpiar" = borra localStorage

---

## 🔗 API Integration

**Axios base**: `http://localhost:8080`

### Interceptor Request

- Agrega `Authorization: Bearer {token}` si no es ruta pública
- Loguea request en localStorage

### Interceptor Response

- Loguea response en localStorage
- 401 → logout automático SIN redirect (solo JSON error)

### Ejemplo uso

```javascript
// GET
const { data } = await api.get("/deportista");

// POST
const { data } = await api.post("/deportista", {
  nombre: "Juan",
  email: "juan@test.com",
  edad: 25,
});

// PUT
const { data } = await api.put(`/deportista/${id}`, formData);

// DELETE
await api.delete(`/deportista/${id}`);
```

---

## 📋 Endpoints Backend Esperados

### AUTENTICACIÓN

- `POST /auth/register` → `{ token, username, email, nombre }`
- `POST /auth/login` → `{ token, username, email, nombre }`
- `GET /auth/me` → `{ username, email, nombre }` (requiere JWT)

### DEPORTISTAS (CRUD)

- `GET /deportista` → `[ { id, nombre, email, edad }, ... ]`
- `POST /deportista` → `{ nombre, email, edad }`
- `PUT /deportista/{id}` → `{ nombre, email, edad }`
- `DELETE /deportista/{id}` → 204 No Content

### ENTRENAMIENTOS (CRUD)

- `GET /entrenamiento` → `[ { id, deportistaId, nombreDeportista, fecha, distancia, tiempoMinutos, disciplina }, ... ]`
- `POST /entrenamiento` → `{ deportistaId, fecha, distancia, tiempoMinutos, disciplina }`
- `PUT /entrenamiento/{id}` → actualizar campos
- `DELETE /entrenamiento/{id}` → 204 No Content

**Disciplinas**: Running | Ciclismo | Natación | Triatlón | Gym | Otro

---

## ✅ CRUD Pattern Implementado

```
1. useEffect → GET /recurso (mount)
2. Table renders data con [Editar] [Eliminar]
3. "Nueva" → CRUDModal vacío
4. Submit → POST /recurso → table recarga
5. [Editar] → CRUDModal pre-llenado
6. Submit → PUT /recurso/{id} → table recarga
7. [Eliminar] → ConfirmDialog
8. Confirm → DELETE /recurso/{id} → table recarga
Cada paso → FeedbackSnackbar feedback
```

---

## 🐛 Validaciones

Lado cliente (frontend):

- Email: formato + único ✅
- Campos requeridos: no-null ✅
- Edad: 1-120 rango ✅
- Distancia: > 0 ✅
- Tiempo: > 0 ✅

Lado servidor (backend): Jakarta Bean Validation (@NotBlank, @Email, @Min, @Max)

---

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
# → http://localhost:5173

# Backend debe estar en :8080
curl http://localhost:8080/auth/me
```

---

## 🧪 Testing Checklist

- [✅] Páginas cargan sin errores
- [✅] Tabla muestra datos GET
- [✅] "Nuevo" abre modal create
- [✅] Modal validaciones funcionan
- [✅] Submit POST y tabla recarga
- [✅] [Editar] pre-llena con datos
- [✅] Submit PUT actualiza tabla
- [✅] [Eliminar] abre ConfirmDialog
- [✅] Confirm DELETE y tabla recarga
- [✅] 401 error → logout automático
- [✅] DebugPanel muestra logs

---

## 🔒 Seguridad

✅ Token localStorage (solo token, no sensible)  
✅ Authorization header en requests  
✅ 401 → logout sin exponer error específico  
✅ CORS configurado localhost:5173  
✅ Validaciones frontend + backend

---

## 📝 Deuda Técnica

- [ ] Orphan entrenamientos sin cascada delete
- [ ] Sin paginación (carga todo en memoria)
- [ ] Sin upload imágenes
- [ ] camelCase: tiempoMinutos vs TiempoMinutos inconsistencia
- [ ] Sin refresh token (expira 24h)

---

**Última edición**: 15 Abril 2026 | **Status**: ✅ Funcional

### Componentes de Navegación

**Navbar.jsx:**

- Barra superior con logo "TrainHub"
- Links condicionales según autenticación
- Botón Logout (solo si autenticado)
- Estilos inline con efectos hover

---

## 📊 Páginas y Componentes

### 1. Inicio.jsx (Pública)

- Página de bienvenida
- Información sobre la plataforma
- Nota para autenticación

### 2. Login.jsx (Pública)

- Formulario con email y contraseña
- Validación de campos
- Redirige a `/entrenamientos` si login es exitoso

### 3. Registro.jsx (Pública)

- Formulario con nombre, email, contraseña
- Validación de coincidencia de contraseñas
- Almacena usuarios en localStorage
- Redirige a `/login` después del registro

### 4. Entrenamientos.jsx (Privada) ⭐ FEATURE PRINCIPAL

- CRUD completo de entrenamientos
- Conecta con backend Spring Boot en `http://localhost:8080/entrenamiento`
- **Funcionalidades GET/DELETE:**
  - Listar entrenamientos
  - Filtrar por distancia > 5km
  - Ordenar ascendente/descendente
  - Eliminar entrenamientos (DELETE)
  - Iconos por disciplina (Running 🏃, Ciclismo 🚴, Natación 🏊, Triatlón 🏅)
- **Funcionalidades POST (nuevas en v1.1):**
  - Formulario para crear nuevos entrenamientos
  - Campo "Distancia (km)" con validación
  - Select "Disciplina" (Running, Ciclismo, Natación, Triatlón, Otro)
  - Botón "➕ Nuevo Entrenamiento" para mostrar/ocultar formulario
  - Mensajes de éxito/error con auto-limpieza
  - Loading state mientras se guarda
  - Refresco automático de lista después de crear

### 5. Estadisticas.jsx (Privada)

- Dashboard de análisis
- Calcula:
  - Total de entrenamientos
  - Distancia total en km
  - Distancia promedio
  - Conteo por disciplina
- Se actualiza desde API al cargar

### 6. NotFound.jsx (404)

- Página personalizada para rutas inválidas
- Botón para volver a inicio

### 7. ProtectedRoute.jsx (Componente)

- HOC (Higher Order Component) para proteger rutas
- Verifica existencia de token
- Redirige a login si no autenticado

### 8. Navbar.jsx (Componente)

- Barra de navegación superior
- Links diferentes según estado de autenticación
- Botón Logout con estilos

---

## 🔌 Integración con Backend

### API Endpoint Principal

| ar   | Ubicación        |
| ---- | ---------------- | -------------------------------- | ------------------------------------ |
| GET  | `/entrenamiento` | Obtener todos los entrenamientos | Entrenamientos.jsx, Estadisticas.jsx |
| POST | `/entrenamiento` | Crear nuevo entrenamiento        | Entrenamientos.jsx (v1.1+)           |

Endpoint: /entrenamiento

````

### Métodos Utilizados

| Método | Endpoint | Uso | Ubicación |
|--------|----------|-----|-----------|
| GET | `/entrenamiento` | Obtener todos los entrenamientos | Entrenamientos.jsx, Estadisticas.jsx |
| DELETE | `/entrenamiento/{id}` | Eliminar un entrenamiento | Entrenamientos.jsx |

### Respuesta Esperada (GET)

```json
[
  {
    "id": 1,
    "distancia": 10,
    "disciplina": {
      "nombre": "Running"
    }
  },
  {
    "id": 2,
    "distancia": 25,
    "disciplina": {
      "nombre": "Ciclismo"
    }
  }
]

### Payload para POST (Crear)

```json
{
  "distancia": 5.5,
  "disciplina": {
    "nombre": "Running"
  }
}
````

````

### Manejo de Errores

- Si API no está disponible: console.error y mensaje de carga
- Si DELETE falla: intenta borrar de la UI solo si `res.ok`

---

## 🎨 Estilos

### Enfoque Actual
- **Inline styles** en React (estilos directos en JSX)
- Colores corporativos:
  - Primario: `#007bff` (azul)
  - Éxito: `#28a745` (verde)
  - Peligro: `#dc3545` (rojo)
  - Fondo: `#333` (gris oscuro navbar)

### CSS Externo
- `index.css` - Estilos globales
- `App.css` - Estilos de App

**Nota:** Migración a TailwindCSS o módulos CSS es opcional para futuro

---

## 📡 Servidor de Desarrollo

### Comando
```bash
npm run dev
````

### Startup

- Vite se inicia en puerto 5173 (or next available)
- Server logs: "VITE v8.0.2 ready in XXXms"
- URL: `http://localhost:5174/` (puede variar si 5173 está ocupado)

### Hot Module Replacement (HMR)

- Vite automáticamente hot-reloads en cambios
- No es necesario reiniciar manualmente

---

## 🐛 Debugging

### Consola del Navegador

- Errores de API en console
- Logs de autenticación con `localStorage`

### React DevTools

- Inspeccionar componentes
- Ver state y props
- Seguimiento de renders

### Rutas No Funcionando

1. ✅ Verificar que BrowserRouter envuelve App en main.jsx
2. ✅ Verificar que Routes esté en App.jsx
3. ✅ Verificar que Link/NavLink estén en Navbar (no `<a href>`)
4. ✅ Verificar que ProtectedRoute tenga localStorage.token

### API No Responde

1. ✅ Verificar que backend Spring Boot está corriendo
2. ✅ Verificar URL: `http://localhost:8080/entrenamiento`
3. ✅ Abrir DevTools → Network para ver requests

---

## ✅ Checklist para IAs - Antes de Hacer Cambios

- [ ] ¿Entiendo la estructura de rutas?
- [ ] ¿Sé cuáles son rutas públicas vs privadas?
- [ ] ¿Debo usar Link/NavLink en lugar de `<a>`?
- [ ] ¿Necesito envolver en ProtectedRoute si es privada?
- [ ] ¿Debo actualizar Navbar si agrego nueva ruta?
- [ ] ¿Debo verificar localStorage para autenticación?
- [ ] ¿Coincido con convenciones de nombres (PascalCase para componentes)?
- [ ] ¿Actualizar este archivo AGENTS.md al terminar?

---

## 📝 Convenciones de Código

### Nombres de Archivos

- **Componentes:** PascalCase (Navbar.jsx, ProtectedRoute.jsx)
- **Páginas:** PascalCase (Login.jsx, Entrenamientos.jsx)
- **Públicos:** lowercase con guiones (index.css, vite.config.js)

### Estructura de Componentes

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MiComponente() {
  const [state, setState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Efectos
  }, []);

  return <div>Contenido</div>;
}
```

### Imports en App.jsx

- React y hooks primero
- Estilos
- Componentes locales (paths relativos ./components)
- Páginas (paths relativos ./pages)

---

## 🚀 Próximos Pasos Sugeridos

1. **Validación avanzada:** Agregar yup o zod para formularios
2. \*� Cambios Recientes

### v1.1 (14/04/2026)

- ✅ Agregado formulario para crear nuevos entrenamientos
- ✅ Implementado POST a API en Entrenamientos.jsx
- ✅ Campos: Distancia (number) y Disciplina (select)
- ✅ Validación y mensajes de éxito/error
- ✅ Loading state durante envío
- ✅ Confirmación al eliminar
- ✅ Mejor UX del componente

## 🔄 Actualización de Este Archivo

**Triggers para actualizar AGENTS.md:**

- ✏️ Agregar/eliminar páginas
- ✏️ Cambiar rutas
- ✏️ Modificar autenticación
- ✏️ Agregar nuevas dependencias
- ✏️ Cambios en estructura de carpetas
- ✏️ Cambios en API endpoints
- ✏️ **CRUD: CREATE/UPDATE/DELETE (v1.1 completado)**

**Formato de actualización:**

```
1. Actualizar sección relevante
2. Actualizar lastUpdated (fecha y versión)
3. Incrementar version (minor)
4. Agregar entrada en "Cambios Recientes"
5 ✏️ Cambiar rutas
- ✏️ Modificar autenticación
- ✏️ Agregar nuevas dependencias
- ✏️ Cambios en estructura de carpetas
- ✏️ Cambios en API endpoints

**Formato de actualización:**
```

1. Actualizar sección relevante
2. Actualizar lastUpdated (fecha)
3. Actualizar version (incrementar minor)
4. Hacer commit con mensaje: "docs: actualizar AGENTS.md"

```

---

## 📚 Referencias Rápidas

- [React Router Official Docs](https://reactrouter.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [localStorage MDN](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [Spring Boot Backend API](#) (agregar URL cuando esté disponible)

---

**Última Actualización:** 14 de abril de 2026
**Versión:** 1.0
**Autor:** GitHub Copilot + Javie
**Estado:** ✅ Completo y listo para uso
```
