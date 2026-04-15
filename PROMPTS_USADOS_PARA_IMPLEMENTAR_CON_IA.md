# � PROMPT PARA COPILOT DEL BACKEND

## 📝 Resumen de Prompts Principales (Implementaciones Clave)

Este archivo documenta lo que se implementó en el frontend basado en tus solicitudes principales:

### 1. **"Configura JWT con Axios interceptor"**
- ✅ Crear `src/services/api.js` con Axios instance
- ✅ Interceptor request: agrega `Authorization: Bearer {token}` automáticamente
- ✅ Interceptor response: maneja 401 sin hacer redirect (solo logout)
- ✅ Rutas públicas detectadas: `/auth/register`, `/auth/login`, `/auth/me`

### 2. **"Setup Tailwind CSS + Material UI"**
- ✅ Instalar tailwindcss, autoprefixer, postcss
- ✅ Crear `tailwind.config.js` + `postcss.config.js`
- ✅ Instalar `@mui/material`, `@emotion/react`, `@emotion/styled`
- ✅ Integración completa en componentes

### 3. **"React Router con rutas protegidas y AuthContext"**
- ✅ Crear `src/context/AuthContext.jsx` con estado global (usuario, token, login/logout)
- ✅ Implementar PrivateRoute wrapper en App.jsx
- ✅ 6 rutas: Home, Login, Registro, Deportistas, Entrenamientos, Estadisticas
- ✅ Logout automático en 401 sin redirecciones

### 4. **"Páginas de Autenticación (Login + Registro)"**
- ✅ `Login.jsx`: POST `/auth/login` → token → redirect a /deportistas
- ✅ `Registro.jsx`: POST `/auth/register` → token → auto-login
- ✅ Validaciones: email formato, campos requeridos
- ✅ Manejo errors: 401 credenciales, 409 usuario duplicado

### 5. **"CRUD Completo de Recursos"**
- ✅ **Deportistas.jsx**: tabla Material UI + modal create/edit + confirmación delete
- ✅ **Entrenamientos.jsx**: tabla con relación a deportistas + modal con selects (Disciplina) + DatePicker
- ✅ **Estadisticas.jsx**: Dashboard con 4 KPIs + gráfico disciplinas + promedios

### 6. **"Implementa Formularios y Diálogos para Modificar, Borrar, Añadir"**
- ✅ **CRUDModal.jsx**: Modal reutilizable create/edit con loading state
- ✅ **ConfirmDialog.jsx**: Diálogo confirmación pre-delete con AlertCircle icon
- ✅ **FeedbackSnackbar.jsx**: Notificaciones success/error/warning/info (auto-hide 4s)
- ✅ Validaciones completas: email único, edad 1-120, distancia/tiempo > 0

### 7. **"Sistema de Logging Persistente para Debug"**
- ✅ localStorage + `addLog()` en api.js
- ✅ **DebugPanel.jsx**: botón 🐛 flotante que muestra últimos 50 logs
- ✅ Logs persist después de refresh de página
- ✅ Color-coded: ❌ error (rojo), ✅ success (verde), 📡 request (azul)

### 8. **"Manejo de Errores y Edge Cases"**
- ✅ Type checking defensivo (disciplina object vs string)
- ✅ Fallback valores nulos
- ✅ Relación deportista en entrenamientos (nombreDeportista incluido)
- ✅ Error 401 logout automático sin redirect

---

**Frontend Status**: ✅ Totalmente funcional  
**Próximo Paso**: Backend debe implementar endpoints según especificación abajo

---

Copia y pega en tu chat de GitHub Copilot Backend:

Mi **frontend React (Vite)** ejecutándose en `http://localhost:5173` espera conectarse a un backend Spring Boot en `http://localhost:8080`.

## 📋 Endpoints Requeridos

### 🔐 AUTENTICACIÓN

**POST /auth/register**
- Request: `{ username, password, email, nombre }`
- Response: `{ token, username, email, nombre }`
- Errores: 400 campos requeridos, 409 email/username duplicados
- Hash password con BCrypt

**POST /auth/login**
- Request: `{ username, password }`
- Response: `{ token, username, email, nombre }`
- Errores: 400 campos requeridos, 401 credenciales inválidas
- JWT token 24h expiration

**GET /auth/me** (requiere JWT)
- Response: `{ username, email, nombre }`
- Errores: 401 token inválido

### 🏃 DEPORTISTAS - CRUD COMPLETO

**GET /deportista** (requiere JWT)
- Response: `[ { id, nombre, email, edad }, ... ]`
- Errores: 401 no autenticado

**POST /deportista** (requiere JWT)
- Request: `{ nombre, email, edad }`
- Response: creado con ID
- Validaciones: nombre no-null, email válido + único, edad 1-120
- Errores: 400 validación, 409 email duplicado

**GET /deportista/{id}** (requiere JWT)
- Response: `{ id, nombre, email, edad }`
- Errores: 404 no encontrado

**PUT /deportista/{id}** (requiere JWT)
- Request: `{ nombre, email, edad }`
- Response: actualizado
- Validaciones: igual que POST (email único entre otros)
- Errores: 404 no encontrado, 400 validación

**DELETE /deportista/{id}** (requiere JWT)
- Response: 204 No Content
- Errores: 404 no encontrado

### 📚 ENTRENAMIENTOS - CRUD COMPLETO

**GET /entrenamiento** (requiere JWT)
- Response: global list
  ```json
  [
    {
      "id": "...",
      "deportistaId": "...",
      "nombreDeportista": "Juan",
      "fecha": "2026-04-15",
      "distancia": 10.5,
      "tiempoMinutos": 45,
      "disciplina": "Running"
    }
  ]
  ```
- Errores: 401 no autenticado

**POST /entrenamiento** (requiere JWT)
- Request:
  ```json
  {
    "deportistaId": "...",
    "fecha": "2026-04-15",
    "distancia": 10.5,
    "tiempoMinutos": 45,
    "disciplina": "Running"
  }
  ```
- Response: creado con ID
- Validaciones:
  - deportistaId exists
  - fecha not null
  - distancia > 0
  - tiempoMinutos > 0 (OR TiempoMinutos - camelCase)
  - disciplina in [Running, Ciclismo, Natación, Triatlón, Gym, Otro]
- Errores: 400 validación, 404 deportista no encontrado

**GET /entrenamiento/{id}** (requiere JWT)
- Response: entrenamiento con nombreDeportista incluido
- Errores: 404 no encontrado

**PUT /entrenamiento/{id}** (requiere JWT)
- Request: mismo que POST (todos los campos opcionales para update)
- Response: actualizado
- Errores: 404 no encontrado, 400 validación

**DELETE /entrenamiento/{id}** (requiere JWT)
- Response: 204 No Content
- Errores: 404 no encontrado

**GET /entrenamiento/deportista/{deportistaId}** (requiere JWT)
- Response: `[ entrenamientos del deportista... ]`
- Errores: 404 deportista no encontrado

---

## ⚙️ Configuración CORS

**CRÍTICO**: Permitir requests desde localhost:5173

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Authorization", "Content-Type")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## 🔑 JWT Token Configuration

**CRÍTICO**:
- ❌ NO hacer redirects (NO 302/303)
- ✅ Retornar 401 en header `Authorization: Bearer {token}` header esperado
- ✅ Todos endpoints EXCEPTO `/auth/register` y `/auth/login` requieren JWT
- ✅ Token expira en 24 horas
- ✅ Respuestas siempre JSON (nunca HTML)

---

## 🗄️ DTOs Esperados (Response Format)

**AuthResponseDTO**
```json
{
  "token": "eyJhbGc...",
  "username": "juan",
  "email": "juan@test.com",
  "nombre": "Juan Pérez"
}
```

**DeportistaDTO**
```json
{
  "id": "uuid",
  "nombre": "Juan",
  "email": "juan@test.com",
  "edad": 25
}
```

**EntrenamientoDTO**
```json
{
  "id": "uuid",
  "deportistaId": "uuid",
  "nombreDeportista": "Juan",
  "fecha": "2026-04-15",
  "distancia": 10.5,
  "tiempoMinutos": 45,
  "disciplina": "Running"
}
```

**DisciplinaDTO** (si separado)
```json
{
  "nombre": "Running"
}
```

---

## ✅ Checklist Implementación

- [ ] POST /auth/register → JWT token + user data
- [ ] POST /auth/login → JWT token + user data
- [ ] GET /auth/me → user data (require JWT)
- [ ] GET /deportista → list all
- [ ] POST /deportista → create
- [ ] PUT /deportista/{id} → update
- [ ] DELETE /deportista/{id} → delete
- [ ] GET /entrenamiento → list all with nombreDeportista
- [ ] POST /entrenamiento → create
- [ ] PUT /entrenamiento/{id} → update
- [ ] DELETE /entrenamiento/{id} → delete
- [ ] CORS configurado para localhost:5173
- [ ] JWT requiere Authorization header (excepto auth)
- [ ] Token NO redirige en 401
- [ ] Email único validation
- [ ] Edad 1-120 validation
- [ ] Disciplina en [Running, Ciclismo, Natación, Triatlón, Gym, Otro]
- [ ] Distancia > 0
- [ ] tiempoMinutos > 0
- [ ] Passwords hasheadas BCrypt
- [ ] Todas responses en JSON

---

## 🧪 Testing Endpoints

```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123","email":"t@t.com","nombre":"Test"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123"}'

# GET /auth/me con JWT
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:8080/auth/me

# GET /deportista
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:8080/deportista

# POST /deportista
curl -X POST -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"j@t.com","edad":25}' \
  http://localhost:8080/deportista
```

---

**Frontend Status**: ✅ En vivo (localhost:5173)  
**Espera Backend**: http://localhost:8080  
**Última actualización**: 15 Abril 2026

---

**PRÓXIMA ACCIÓN:**

Por favor:
1. Configura CORS permitiendo los 3 localhost mencionados
2. Implementa los endpoints de autenticación (register, login, me)
3. Implementa endpoints de deportistas (CRUD)
4. Implementa endpoints de entrenamientos (CRUD + imagen + import/export)
5. Asegúrate que todos los DTOs estén en camelCase
6. **CRÍTICO**: En JWT inválido, retorna 401 (NO 302)
7. De todos los endpoints EXCEPTO auth deben requerir token

Aquí está el documento completo con más detalles  
→ Archivo: `FRONTEND_REQUIREMENTS.md` en el repositorio

---

**TEST RÁPIDO** (después de implementar):
```bash
# 1. Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123","email":"test@test.com","nombre":"Test"}'

# 2. Copiar TOKEN de respuesta y reemplazar {TOKEN}

# 3. Get deportistas (debe retornar array vacío inicialmente)
curl -X GET http://localhost:8080/deportista \
  -H "Authorization: Bearer {TOKEN}"

# 4. Si retorna 401 → problema con JWT validation
# Si retorna 302 → problema con redirecciones (cambiar a 401)
# Si retorna [] con 200 → ¡CORRECTO!
```

---

¿Necesitas que implemente algo específico? Estoy listo para ayudarte.

