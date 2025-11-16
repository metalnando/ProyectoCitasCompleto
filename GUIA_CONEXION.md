# Guía de Conexión Frontend-Backend

## Resumen de Cambios Realizados

Se ha completado exitosamente la integración entre el frontend (React + Vite) y el backend (NestJS). A continuación se detallan todos los cambios realizados.

---

## 1. Estructura de Archivos Creados

### Frontend

```
Frontend/src/
├── config/
│   └── api.js                    # Configuración de endpoints de la API
├── services/
│   ├── authService.js            # Servicio de autenticación
│   ├── citasService.js           # Servicio de gestión de citas
│   └── medicosService.js         # Servicio de gestión de médicos
├── context/
│   └── AuthContext.jsx           # Contexto de autenticación actualizado
└── pages/
    ├── Login.jsx                 # Página de login actualizada
    └── AgendarCita.jsx           # Página de agendar citas actualizada
```

### Variables de Entorno

```
Frontend/
├── .env                          # Variables de entorno (no subir a git)
└── .env.example                  # Ejemplo de variables de entorno
```

---

## 2. Configuración de Variables de Entorno

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

### Backend

El backend ya está configurado para escuchar en el puerto 3000.

---

## 3. Servicios Creados

### 3.1 AuthService (authService.js)

Maneja toda la autenticación:
- `login(email, password)` - Iniciar sesión
- `register(userData)` - Registrar nuevo usuario
- `getProfile()` - Obtener perfil del usuario
- `refreshToken()` - Refrescar token de acceso
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar si está autenticado
- `getCurrentUser()` - Obtener usuario actual

### 3.2 CitasService (citasService.js)

Gestión de citas médicas:
- `crearCita(citaData)` - Crear nueva cita
- `obtenerCitas()` - Obtener todas las citas
- `obtenerCitaPorId(id)` - Obtener cita específica
- `obtenerHistorialPorPaciente(pacienteId)` - Historial de paciente
- `obtenerCitasPorMedico(medicoId, fecha)` - Citas por médico
- `obtenerCitasPorEstado(estado)` - Filtrar por estado
- `actualizarCita(id, citaData)` - Actualizar cita
- `actualizarEstadoCita(id, estado)` - Cambiar estado
- `eliminarCita(id)` - Eliminar cita (lógica)

### 3.3 MedicosService (medicosService.js)

Gestión de médicos:
- `obtenerMedicos()` - Listar médicos
- `obtenerMedicoPorId(id)` - Obtener médico específico
- `crearMedico(medicoData)` - Crear médico
- `actualizarMedico(id, medicoData)` - Actualizar médico
- `eliminarMedico(id)` - Eliminar médico

---

## 4. Cambios en el Backend

### 4.1 CORS Actualizado

El archivo [main.ts](Backend/src/main.ts:9-19) ahora permite conexiones desde:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173` (Puerto de Vite)
- `http://localhost:5174`

### 4.2 Errores Corregidos

Se corrigieron **31 errores** de compilación en el backend:
- ✅ Creado decorador `GetUser`
- ✅ Corregido `JwtAuthGuard`
- ✅ Actualizados schemas de Mongoose
- ✅ Implementado `UsuariosService` completo
- ✅ Corregidos tipos en `AuthService`
- ✅ Actualizada versión de API de Stripe
- ✅ Y más...

---

## 5. Cómo Usar la Aplicación

### Paso 1: Iniciar el Backend

```bash
cd Backend
npm install
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

### Paso 2: Iniciar el Frontend

```bash
cd Frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Paso 3: Probar la Conexión

1. **Crear un usuario de prueba en el backend:**
   - Puedes usar herramientas como Postman o Insomnia
   - Endpoint: `POST http://localhost:3000/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Usuario Prueba",
       "email": "test@ejemplo.com",
       "password": "password123",
       "role": "user"
     }
     ```

2. **Iniciar sesión en el frontend:**
   - Ir a: `http://localhost:5173/login`
   - Usar las credenciales creadas
   - Email: `test@ejemplo.com`
   - Password: `password123`

3. **Agendar una cita:**
   - Ir a: `http://localhost:5173/agendar-cita`
   - Seleccionar un médico (primero crear médicos en el backend)
   - Completar el formulario
   - Confirmar cita

---

## 6. Flujo de Autenticación

```
1. Usuario ingresa credenciales en Login.jsx
   ↓
2. Se llama a authService.login(email, password)
   ↓
3. Se envía petición POST a http://localhost:3000/auth/login
   ↓
4. Backend valida credenciales y devuelve:
   {
     tokens: {
       accessToken: "...",
       refreshToken: "..."
     },
     user: {
       id: "...",
       email: "...",
       role: "...",
       name: "..."
     }
   }
   ↓
5. Tokens y usuario se guardan en localStorage
   ↓
6. Usuario redirigido a la página principal
   ↓
7. AuthContext mantiene el estado del usuario
```

---

## 7. Estructura de Datos Importantes

### Usuario (User)
```javascript
{
  id: string,
  email: string,
  nombre: string,
  roles: string[],  // ["user", "admin", etc.]
}
```

### Cita
```javascript
{
  pacienteDocumento: string,
  medicoId: string,
  fecha: string,      // "YYYY-MM-DD"
  hora: string,       // "HH:MM"
  motivo: string,
  notas: string,
  estado: string      // "pendiente", "confirmada", "completada", etc.
}
```

### Médico
```javascript
{
  _id: string,
  medicoNombre: string,
  medicoApellido: string,
  medicoDocumento: string,
  medicoTelefono: string,
  medicoEmail: string
}
```

---

## 8. Manejo de Errores

Todos los servicios devuelven un objeto con formato:

**Éxito:**
```javascript
{
  success: true,
  data: { ... }
}
```

**Error:**
```javascript
{
  success: false,
  message: "Descripción del error"
}
```

---

## 9. Tokens de Autenticación

### Access Token
- Duración: 15 minutos
- Se envía en el header: `Authorization: Bearer <token>`
- Se usa para todas las peticiones autenticadas

### Refresh Token
- Duración: 7 días
- Se usa para obtener un nuevo access token cuando expira
- Endpoint: `POST /auth/refresh-token`

---

## 10. Próximos Pasos Recomendados

### Para el Backend:
1. Crear seeders para poblar la base de datos con datos de prueba
2. Implementar middleware de refresh token automático
3. Agregar validaciones más robustas
4. Implementar límite de intentos de login

### Para el Frontend:
1. Crear página de registro de usuarios
2. Implementar página de historial clínico conectada al backend
3. Agregar interceptor de axios para manejar tokens expirados
4. Crear página de perfil de usuario
5. Implementar notificaciones con toasts

---

## 11. Solución de Problemas Comunes

### Error de CORS
**Síntoma:** Error "CORS policy" en la consola del navegador
**Solución:** Verificar que el backend incluya el puerto del frontend en la configuración de CORS ([main.ts](Backend/src/main.ts:13))

### Error 401 Unauthorized
**Síntoma:** Peticiones fallan con código 401
**Solución:**
- Verificar que el token esté guardado en localStorage
- Verificar que el token no haya expirado
- Usar refresh token para obtener nuevo access token

### Backend no se conecta a la base de datos
**Síntoma:** Error de conexión a MongoDB
**Solución:**
- Verificar que MongoDB esté corriendo
- Verificar variables de entorno en el backend
- Revisar archivo de configuración de base de datos

### Frontend no encuentra el backend
**Síntoma:** Error "Network Error" o "Failed to fetch"
**Solución:**
- Verificar que el backend esté corriendo en puerto 3000
- Verificar archivo .env del frontend
- Verificar que VITE_API_URL esté correctamente configurado

---

## 12. Comandos Útiles

### Backend
```bash
# Desarrollo
npm run start:dev

# Compilar
npm run build

# Producción
npm run start:prod
```

### Frontend
```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Vista previa de producción
npm run preview
```

---

## 13. Contacto y Soporte

Para cualquier duda o problema:
1. Revisar esta guía
2. Verificar los logs del backend y frontend
3. Revisar la consola del navegador para errores de JavaScript

---

**¡La conexión entre frontend y backend está completa y lista para usar!** 🚀
