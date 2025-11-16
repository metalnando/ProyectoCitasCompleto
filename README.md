# Sistema de Gestión de Citas Médicas - Consultorio Dental

Sistema completo de gestión de citas médicas para consultorios dentales, desarrollado con **NestJS** (Backend) y **React** (Frontend).

## Características Principales

### Panel de Usuario
- Registro e inicio de sesión con JWT
- Visualización de especialistas disponibles
- Agendamiento de citas médicas
- Historial clínico personal
- Gestión de perfil de usuario
- Calendario interactivo de citas

### Panel de Administración
- Dashboard con estadísticas
- Gestión completa de médicos (CRUD)
- Subida de fotos de médicos
- Gestión de tratamientos
- Control de citas y pagos
- Facturación y reportes

### Funcionalidades Técnicas
- Autenticación JWT con refresh tokens
- Subida y gestión de imágenes
- Integración con MongoDB Atlas
- API RESTful completa
- Validación de datos
- Protección de rutas por roles

## Tecnologías Utilizadas

### Backend
- **NestJS** v11.0.1
- **MongoDB** con Mongoose v8.13.2
- **JWT** para autenticación
- **Multer** para subida de archivos
- **Class Validator** para validación
- **Bcrypt** para encriptación de contraseñas

### Frontend
- **React** v19.1.0
- **React Router DOM** v7.6.3
- **React Bootstrap** v2.10.10
- **Bootstrap** v5.3.7
- **Context API** para estado global

## Estructura del Proyecto

```
ProyectoCitasCompleto/
├── Backend/                    # API REST con NestJS
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── citas/             # Gestión de citas
│   │   ├── facturas/          # Facturación
│   │   ├── medico/            # Gestión de médicos
│   │   ├── pacientes/         # Gestión de pacientes
│   │   ├── pago/              # Procesamiento de pagos
│   │   ├── tratamientos/      # Catálogo de tratamientos
│   │   ├── usuarios/          # Gestión de usuarios
│   │   └── estadisticas/      # Reportes y estadísticas
│   ├── uploads/               # Archivos subidos (imágenes)
│   └── .env                   # Variables de entorno
│
├── Frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Servicios de API
│   │   ├── context/           # Context API (Auth)
│   │   └── config/            # Configuración de endpoints
│   └── public/                # Archivos estáticos
│
└── README.md
```

## Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **MongoDB** (local o Atlas)
- **Git**

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/metalnando/ProyectoCitasCompleto.git
cd ProyectoCitasCompleto
```

### 2. Configurar Backend

```bash
cd Backend
npm install
```

Crear archivo `.env` en la carpeta Backend:

```env
MONGODB_URL=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/citas?
JWT_SECRET=tu_secret_key_segura
STRIPE_SECRET_KEY=tu_stripe_key
```

### 3. Configurar Frontend

```bash
cd Frontend
npm install
```

Crear archivo `.env` en la carpeta Frontend (opcional):

```env
VITE_API_URL=http://localhost:3000
```

## Ejecución

### Iniciar Backend

```bash
cd Backend
npm run start:dev
```

El servidor se ejecutará en `http://localhost:3000`

### Iniciar Frontend

```bash
cd Frontend
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

## API Endpoints

### Autenticación
- `POST /usuarios/register` - Registro de usuario
- `POST /usuarios/login` - Inicio de sesión
- `GET /usuarios/perfil` - Obtener perfil del usuario

### Médicos
- `GET /medico` - Listar todos los médicos
- `GET /medico/:id` - Obtener médico por ID
- `POST /medico` - Crear médico (con imagen)
- `PUT /medico/:id` - Actualizar médico (con imagen)
- `DELETE /medico/:id` - Eliminar médico

### Citas
- `GET /citas` - Listar todas las citas
- `GET /citas/:id` - Obtener cita por ID
- `POST /citas` - Crear nueva cita
- `PUT /citas/:id` - Actualizar cita
- `DELETE /citas/:id` - Cancelar cita

### Tratamientos
- `GET /tratamientos` - Listar tratamientos
- `POST /tratamientos` - Crear tratamiento
- `PUT /tratamientos/:id` - Actualizar tratamiento
- `DELETE /tratamientos/:id` - Eliminar tratamiento

### Facturación
- `GET /facturas` - Listar facturas
- `GET /facturas/paciente/:id` - Facturas por paciente
- `POST /facturas` - Crear factura

## Modelos de Base de Datos

### Usuario
```javascript
{
  nombre: String,
  email: String (requerido),
  password: String (requerido),
  documento: String (único),
  telefono: String,
  direccion: String,
  roles: [String] // ['user', 'admin']
}
```

### Médico
```javascript
{
  medicoNombre: String (requerido),
  medicoApellido: String (requerido),
  medicoDocumento: String (requerido),
  medicoTelefono: String (requerido),
  medicoEmail: String (requerido),
  especialidad: String (default: 'General'),
  imagen: String // Ruta de la foto
}
```

### Cita
```javascript
{
  paciente: ObjectId (ref: Paciente),
  medico: ObjectId (ref: Medicos),
  fecha: Date (requerido),
  hora: String (requerido),
  motivo: String (requerido),
  estado: String ['pendiente', 'confirmada', 'completada', 'cancelada'],
  duracion: Number (minutos),
  consultorio: String,
  tratamiento: ObjectId (ref: Tratamiento),
  costo: Number,
  estadoPago: String ['pendiente', 'pagada', 'vencida']
}
```

### Tratamiento
```javascript
{
  nombre: String (requerido),
  descripcion: String (requerido),
  precio: Number (requerido),
  duracion: Number (minutos),
  imagen: String,
  estado: String (default: 'activo')
}
```

## Características de Seguridad

- **Autenticación JWT** con tokens de acceso y refresh
- **Encriptación** de contraseñas con bcrypt
- **Validación** de datos en backend y frontend
- **Protección de rutas** por roles (admin/user)
- **CORS** configurado para dominios específicos
- **Sanitización** de entradas de usuario

## Rutas del Frontend

### Públicas
- `/` - Página de inicio
- `/especialistas` - Ver especialistas
- `/tratamientos` - Ver tratamientos
- `/login` - Iniciar sesión
- `/register` - Registro

### Usuario Autenticado
- `/agendar-cita` - Agendar nueva cita
- `/historial` - Historial clínico
- `/mis-citas` - Mis citas
- `/perfil` - Mi perfil

### Administrador
- `/admin` - Dashboard administrativo
- `/admin/medicos` - Gestión de médicos
- `/admin/tratamientos` - Gestión de tratamientos

## Funcionalidades Destacadas

### Subida de Imágenes de Médicos
- Soporte para JPG, PNG, GIF, WEBP
- Límite de 5MB por archivo
- Preview antes de guardar
- Almacenamiento en servidor
- Fallback con iniciales si no hay imagen

### Calendario de Citas
- Vista mensual interactiva
- Colores por estado de cita
- Filtros por médico
- Detalles al hacer clic

### Gestión de Especialistas
- Búsqueda en tiempo real
- Filtro por especialidad
- Cards con información completa
- Fotos o avatares automáticos

## Scripts Disponibles

### Backend
```bash
npm run start:dev    # Desarrollo con hot reload
npm run start:prod   # Producción
npm run build        # Compilar
npm run test         # Ejecutar tests
```

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Preview de producción
npm run lint         # Linter
```

## Solución de Problemas Comunes

### Error de conexión MongoDB
- Verificar string de conexión en `.env`
- Revisar IP whitelist en MongoDB Atlas
- Confirmar usuario y contraseña

### CORS errors
- Backend debe estar corriendo en puerto 3000
- Frontend en puerto 5173
- Verificar configuración en `main.ts`

### Imágenes no se muestran
- Verificar que existe carpeta `uploads/medicos/`
- Confirmar permisos de escritura
- Revisar ruta en `main.ts`

## Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Autor

Desarrollado por **Fernando** - [@metalnando](https://github.com/metalnando)

## Agradecimientos

- NestJS por el framework backend robusto
- React y React Bootstrap por la UI
- MongoDB Atlas por la base de datos en la nube
- La comunidad open source

---

**Sistema de Citas Médicas** - Simplificando la gestión de tu consultorio dental
