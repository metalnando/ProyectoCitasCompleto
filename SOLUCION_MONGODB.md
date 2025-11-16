# 🔧 Solución al Problema de MongoDB

## 🎯 El Problema Identificado

El error "Failed to fetch" ocurre porque **el backend no puede conectarse a MongoDB Atlas**.

El error completo es:
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster
```

---

## ✅ Soluciones (Elige UNA)

### Opción 1: Usar MongoDB Atlas (Recomendado para Producción)

#### Paso 1.1: Verificar tu IP en MongoDB Atlas

1. Ir a [MongoDB Atlas](https://cloud.mongodb.com/)
2. Iniciar sesión con tu cuenta
3. Seleccionar tu cluster
4. Ir a **Network Access** (Acceso a la red)
5. Click en **Add IP Address**
6. Seleccionar **Add Current IP Address**
7. O seleccionar **Allow Access from Anywhere** (0.0.0.0/0) para desarrollo

![MongoDB Atlas IP Whitelist](https://webimages.mongodb.com/_com_assets/cms/kyrxnrjf8yy4wljqr-image3.png?auto=format%2Ccompress)

#### Paso 1.2: Verificar Usuario y Contraseña

1. En MongoDB Atlas, ir a **Database Access**
2. Verificar que el usuario `citasmedicasplus` existe
3. Si no existe, crear uno nuevo:
   - Click en **Add New Database User**
   - Username: `citasmedicasplus`
   - Password: (elige una contraseña segura)
   - Database User Privileges: **Read and write to any database**

#### Paso 1.3: Actualizar la Cadena de Conexión

Editar `Backend/src/app.module.ts`:

```typescript
MongooseModule.forRoot(
  'mongodb+srv://TU_USUARIO:TU_PASSWORD@citas.skswp.mongodb.net/citas?retryWrites=true&w=majority'
),
```

**IMPORTANTE:** Reemplazar `TU_USUARIO` y `TU_PASSWORD` con tus credenciales reales.

---

### Opción 2: Usar MongoDB Local (Recomendado para Desarrollo)

#### Paso 2.1: Instalar MongoDB Community Edition

**Windows:**
1. Descargar de: https://www.mongodb.com/try/download/community
2. Ejecutar el instalador
3. Seguir los pasos del asistente
4. Marcar "Install MongoDB as a Service"

**Verificar instalación:**
```bash
mongod --version
```

#### Paso 2.2: Iniciar MongoDB

**Windows (si se instaló como servicio):**
```bash
# Verificar si está corriendo
sc query MongoDB

# Si no está corriendo, iniciarlo
net start MongoDB
```

**O manualmente:**
```bash
# Crear carpeta para datos (primera vez)
mkdir C:\data\db

# Iniciar MongoDB
mongod --dbpath="C:\data\db"
```

#### Paso 2.3: Actualizar la Conexión en el Backend

Editar `Backend/src/app.module.ts`:

```typescript
MongooseModule.forRoot('mongodb://localhost:27017/consultorio-medico'),
```

**Archivo completo:**
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitasModule } from './citas/citas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PacientesModule } from './pacientes/pacientes.module';
import { MedicoModule } from './medico/medico.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PagoModule } from './pago/pago.module';
import { FacturasModule } from './facturas/facturas.module';
import { ConfigModule } from '@nestjs/config';
import { TratamientoModule } from './tratamientos/tratamiento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/consultorio-medico'),
    HttpModule,
    CitasModule,
    PacientesModule,
    MedicoModule,
    PagoModule,
    UsuariosModule,
    TratamientoModule,
    FacturasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### Opción 3: Usar Variables de Entorno (La Mejor Práctica)

#### Paso 3.1: Crear archivo .env

Crear `Backend/.env`:

```env
# Para MongoDB Local
MONGODB_URI=mongodb://localhost:27017/consultorio-medico

# O para MongoDB Atlas
# MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@citas.skswp.mongodb.net/citas?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu-secreto-super-seguro-aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=tu-stripe-key-aqui
```

#### Paso 3.2: Actualizar app.module.ts

```typescript
MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/consultorio-medico'),
```

---

## 🚀 Pasos Después de la Configuración

### 1. Detener el Backend (si está corriendo)
Presionar `Ctrl + C` en la terminal del backend

### 2. Reiniciar el Backend
```bash
cd Backend
npm run start:dev
```

### 3. Verificar que Conecte Correctamente

Deberías ver algo como:
```
[Nest] Starting Nest application...
[Nest] MongooseModule dependencies initialized
[Nest] Successfully connected to MongoDB
[Nest] Mapped {/auth/login, POST} route
[Nest] Mapped {/auth/register, POST} route
...
[Nest] Nest application successfully started
```

**NO deberías ver:**
```
❌ Unable to connect to the database. Retrying...
```

---

## 🧪 Probar la Conexión

### Opción A: Usando el Frontend

1. Ir a http://localhost:5173/register
2. Completar el formulario
3. Click en "Crear Cuenta"
4. Abrir DevTools (F12) y ver la consola
5. Deberías ver logs como:
   ```
   🔍 [DEBUG] Iniciando registro...
   📤 [DEBUG] URL: http://localhost:3000/auth/register
   📦 [DEBUG] Datos a enviar: {...}
   📥 [DEBUG] Respuesta recibida - Status: 201
   ✅ [DEBUG] Tokens guardados
   ✅ [DEBUG] Usuario guardado
   ```

### Opción B: Usando Postman/Insomnia

```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Respuesta esperada (201 Created):**
```json
{
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

---

## 📋 Checklist Completo

- [ ] MongoDB está corriendo (local O Atlas configurado)
- [ ] La IP está en la whitelist (si usas Atlas)
- [ ] Usuario y contraseña correctos (si usas Atlas)
- [ ] Cadena de conexión actualizada en `app.module.ts`
- [ ] Backend reiniciado después de cambios
- [ ] Backend muestra "Successfully connected to MongoDB"
- [ ] No hay errores "Unable to connect to the database"
- [ ] Frontend en http://localhost:5173
- [ ] DevTools abierto (F12) para ver logs

---

## 🎯 Recomendación para tu Caso

**Para DESARROLLO (ahora mismo):**
```typescript
// Backend/src/app.module.ts
MongooseModule.forRoot('mongodb://localhost:27017/consultorio-medico'),
```

**Ventajas:**
- ✅ Más rápido
- ✅ No depende de internet
- ✅ Sin límites de conexiones
- ✅ Gratis sin límites

**Pasos:**
1. Instalar MongoDB local
2. Iniciar MongoDB: `net start MongoDB`
3. Cambiar la conexión en `app.module.ts`
4. Reiniciar backend

---

## 🐛 Si Aún No Funciona

### Debug Paso a Paso:

1. **Verificar MongoDB está corriendo:**
   ```bash
   # Windows
   sc query MongoDB

   # O intentar conectarse
   mongosh
   ```

2. **Ver logs del backend:**
   - Buscar líneas con `[MongooseModule]`
   - Copiar el error completo

3. **Verificar puerto:**
   ```bash
   netstat -ano | findstr :27017
   # Debería mostrar MongoDB escuchando
   ```

4. **Probar conexión manual:**
   ```bash
   mongosh mongodb://localhost:27017/consultorio-medico
   # Debería conectarse sin errores
   ```

---

## 📞 Error Común: "MongoDB no es un comando reconocido"

Significa que MongoDB no está instalado o no está en el PATH.

**Solución:**
1. Verificar instalación: `"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --version`
2. Si funciona, agregar al PATH:
   - Panel de Control → Sistema → Configuración avanzada
   - Variables de entorno
   - Agregar: `C:\Program Files\MongoDB\Server\7.0\bin`

---

**¡Con estos pasos tu aplicación debería funcionar perfectamente!** 🎉
