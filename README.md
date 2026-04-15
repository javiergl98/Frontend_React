# 🏃 Sistema Gestión Deportiva - Frontend React

**Stack**: React 19 + Vite + Material UI 5 + Tailwind + Axios JWT  
**Backend**: Spring Boot 4 + MongoDB  
**Puertos**: Frontend `:5173` | Backend `:8080`  
**Estado**: ✅ Funcional (CRUD completo)

---

## 📋 Qué Es

Portal web moderno para gestión de deportistas y entrenamientos con:

- ✅ **Autenticación JWT** (registro/login)
- ✅ **CRUD Deportistas** (tabla + modal create/edit + confirmación delete)
- ✅ **CRUD Entrenamientos** (tabla relación deportistas + modal con selects)
- ✅ **Dashboard** estad. globales (4 KPIs + desglose disciplina)
- ✅ **Material UI** componentes profesionales
- ✅ **Validaciones** completas cliente + servidor
- ✅ **Logs persistentes** localStorage + DebugPanel

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar deps
npm install

# 2. Dev server
npm run dev
# → http://localhost:5173

# 3. Backend debe estar en :8080
```

---

## 📁 Estructura Core

```
src/
├── context/AuthContext.jsx          # JWT + usuario global
├── services/api.js                  # Axios + interceptor JWT + logging
├── pages/
│   ├── Deportistas.jsx              # CRUD tabla + modal
│   ├── Entrenamientos.jsx           # CRUD tabla + relación deportistas
│   ├── Estadisticas.jsx             # Dashboard KPIs
│   ├── Login.jsx                    # POST /auth/login
│   ├── Registro.jsx                 # POST /auth/register
│   └── [Home.jsx, NotFound.jsx]
└── components/
    ├── CRUDModal.jsx                # Modal create/edit (reutilizable)
    ├── ConfirmDialog.jsx            # Confirmación delete
    ├── FeedbackSnackbar.jsx         # Notificaciones
    └── DebugPanel.jsx               # Logger localStorage flotante
```

---

## 🎨 Páginas

### **Deportistas**

- Tabla: Nombre, Email, Edad, [Editar] [Eliminar]
- Modal: Crear/editar con validaciones
- Confirmación pre-delete
- Feedback snackbars

### **Entrenamientos**

- Tabla: Disciplina, Deportista, Fecha, Distancia, Tiempo, [Editar] [Eliminar]
- Modal: Selects (Deportista, Disciplina), DatePicker, números
- Validaciones: requeridos, valores > 0
- Relación a deportista

### **Estadísticas**

- 4 KPIs: Deportistas, Entrenamientos, Distancia total, Tiempo total
- Gráfico: Entrenamientos por disciplina
- Promedios calculados

---

## 🔗 Endpoints Backend Requeridos

| Método              | Ruta               | Descripción                 |
| ------------------- | ------------------ | --------------------------- |
| POST                | `/auth/register`   | Crear usuario + retorna JWT |
| POST                | `/auth/login`      | Login + retorna JWT         |
| GET/POST/PUT/DELETE | `/deportista**`    | CRUD deportistas            |
| GET/POST/PUT/DELETE | `/entrenamiento**` | CRUD entrenamientos         |

---

## 🔐 Autenticación

**Flujo JWT**:

1. POST `/auth/register` u `/auth/login`
2. Backend retorna `{ token, username, email, nombre }`
3. Token → localStorage + AuthContext
4. Axios agrega `Authorization: Bearer {token}` automáticamente
5. 401 → logout sin redirect, snackbar muestra error

---

## 🛠️ Tech Stack

| Tech         | Versión | Propósito            |
| ------------ | ------- | -------------------- |
| React        | 19      | UI                   |
| Vite         | 8       | Dev server + bundler |
| Material UI  | 5       | Componentes UI       |
| Axios        | 1.15    | HTTP client          |
| React Router | 7       | Rutas                |
| Tailwind     | 3       | CSS utilities        |
| Lucide       | 0.x     | Icons                |

---

## ✅ CRUD Pattern

```
1. GET /recurso → tabla
2. "Nuevo" → CRUDModal vacío
3. Submit → POST → tabla recarga
4. [Editar] → CRUDModal pre-llenado
5. Submit → PUT → tabla recarga
6. [Eliminar] → ConfirmDialog
7. Confirm → DELETE → tabla recarga
Todos los pasos → FeedbackSnackbar feedback
```

---

## 📊 Validaciones

✅ Email formato + único  
✅ Campos requeridos no-null  
✅ Edad 1-120 rango  
✅ Distancia > 0  
✅ Tiempo > 0

---

## 🐛 Debugging

- **DebugPanel 🐛**: Botón flotante bottom-right con últimos 50 logs (localStorage)
- **Network**: DevTools → Authorization header con JWT
- **React DevTools**: Inspeccionar AuthContext state

---

## 📝 Deuda Técnica

- [ ] Sin paginación (carga todo en memoria)
- [ ] Sin upload imágenes
- [ ] Orphan entrenamientos sin cascada delete
- [ ] camelCase inconsistencia: tiempoMinutos vs TiempoMinutos
- [ ] Sin refresh token (expira 24h)

---

**Version**: 1.0 | **Estado**: ✅ Funcionando | **Última edit**: 15 Abril 2026

Para documentación completa ver: **AGENTS.md** (arquitectura) y **PROMPT_PARA_COPILOT_BACKEND.md** (endpoints backend)
