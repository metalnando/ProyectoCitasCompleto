# Solución al Error "Failed to Fetch"

## 🔍 Diagnóstico del Problema

El error "Failed to fetch" ocurre cuando el frontend no puede conectarse al backend. Aquí están las causas más comunes y sus soluciones:

---

## ✅ Solución Paso a Paso

### 1. Verificar que el Backend esté corriendo

**Paso 1.1:** Abrir una terminal en la carpeta del Backend
```bash
cd Backend
```

**Paso 1.2:** Iniciar el backend
```bash
npm run start:dev
```

**Paso 1.3:** Verificar que veas un mensaje similar a:
```
[Nest] Application successfully started
[Nest] Mapped {/auth/login, POST} route
[Nest] Mapped {/auth/register, POST} route
...
Listening on port 3000
```

**Si el backend NO arranca:**
- Verificar que MongoDB esté corriendo
- Verificar que no haya otro proceso usando el puerto 3000
- Revisar los errores en la consola

---

### 2. Verificar MongoDB

**Paso 2.1:** Verificar si MongoDB está corriendo
```bash
# En Windows (CMD como administrador)
sc query MongoDB

# O intentar conectarse
mongosh
```

**Si MongoDB NO está corriendo:**
```bash
# Iniciar MongoDB (Windows)
net start MongoDB

# O si usas mongod directamente
mongod --dbpath="C:\data\db"
```

---

### 3. Verificar Puerto del Backend

**Paso 3.1:** Verificar que el backend esté escuchando en el puerto 3000
```bash
# Windows
netstat -ano | findstr :3000

# Deberías ver algo como:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    1234
```

**Si el puerto 3000 está ocupado por otro proceso:**
- Opción 1: Cerrar el otro proceso
- Opción 2: Cambiar el puerto del backend

**Para cambiar el puerto del backend:**
1. Abrir `Backend/src/main.ts`
2. Cambiar la línea:
   ```typescript
   await app.listen(3000);
   ```
   Por:
   ```typescript
   await app.listen(3001); // O el puerto que prefieras
   ```
3. Actualizar `Frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3001
   ```

---

### 4. Verificar CORS en el Backend

**Paso 4.1:** Abrir `Backend/src/main.ts`

**Paso 4.2:** Verificar que la configuración de CORS incluya el puerto del frontend:
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', // Puerto de Vite (IMPORTANTE)
    'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

---

### 5. Verificar Variables de Entorno del Frontend

**Paso 5.1:** Abrir `Frontend/.env`

**Paso 5.2:** Verificar que exista y contenga:
```env
VITE_API_URL=http://localhost:3000
```

**Paso 5.3:** SI CAMBIAS EL ARCHIVO .env, DEBES REINICIAR VITE:
1. Detener el servidor de Vite (Ctrl + C)
2. Volver a iniciar:
   ```bash
   npm run dev
   ```

---

### 6. Probar el Endpoint Manualmente

**Paso 6.1:** Con el backend corriendo, abrir un navegador o Postman

**Paso 6.2:** Probar el endpoint de registro:
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Si funciona:** El problema está en el frontend
**Si NO funciona:** El problema está en el backend

---

### 7. Verificar la Consola del Navegador

**Paso 7.1:** Abrir DevTools en el navegador (F12)

**Paso 7.2:** Ir a la pestaña "Network" (Red)

**Paso 7.3:** Intentar registrarse nuevamente

**Paso 7.4:** Buscar la petición a `/auth/register` y revisar:
- **Status:** ¿Qué código de estado devuelve?
- **Response:** ¿Qué mensaje de error aparece?
- **Headers:** ¿Se está enviando el Content-Type correcto?

---

## 🐛 Errores Comunes y Soluciones

### Error: "ECONNREFUSED"
**Causa:** El backend no está corriendo
**Solución:** Iniciar el backend con `npm run start:dev`

### Error: "CORS policy"
**Causa:** El puerto del frontend no está en la lista de CORS
**Solución:** Agregar el puerto a `main.ts` (ver paso 4)

### Error: "Cannot connect to MongoDB"
**Causa:** MongoDB no está corriendo
**Solución:** Iniciar MongoDB (ver paso 2)

### Error: "Port 3000 is already in use"
**Causa:** Otro proceso está usando el puerto 3000
**Solución:** Cerrar el otro proceso o cambiar el puerto (ver paso 3)

---

## 🔧 Script de Diagnóstico Rápido

Crea un archivo `test-connection.js` en la raíz del proyecto:

```javascript
// test-connection.js
const fetch = require('node-fetch');

async function testBackend() {
  console.log('🔍 Probando conexión al backend...\n');

  try {
    console.log('1. Probando http://localhost:3000/auth/register...');
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('✅ Respuesta recibida!');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('- Verifica que el backend esté corriendo (npm run start:dev)');
    console.log('- Verifica que MongoDB esté corriendo');
    console.log('- Verifica que el puerto 3000 esté libre');
  }
}

testBackend();
```

Ejecutar:
```bash
node test-connection.js
```

---

## 📋 Checklist de Verificación

Antes de intentar registrarse, verifica:

- [ ] MongoDB está corriendo
- [ ] Backend está corriendo (`npm run start:dev`)
- [ ] Backend muestra "Listening on port 3000"
- [ ] No hay errores en la consola del backend
- [ ] Frontend está corriendo (`npm run dev`)
- [ ] Archivo `.env` existe en Frontend con `VITE_API_URL=http://localhost:3000`
- [ ] CORS está configurado correctamente en `main.ts`
- [ ] Navegador no tiene extensiones que bloqueen peticiones (desactivar AdBlock)

---

## 🚀 Inicio Rápido (Desde Cero)

**Terminal 1 - Backend:**
```bash
cd Backend
npm install
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

**Terminal 3 - MongoDB (si es necesario):**
```bash
mongod --dbpath="C:\data\db"
```

Luego abrir: http://localhost:5173/register

---

## 📞 Si Nada Funciona

1. **Cerrar TODO** (Backend, Frontend, MongoDB)
2. **Reiniciar la computadora**
3. **Iniciar MongoDB primero**
4. **Iniciar Backend**
5. **Iniciar Frontend**
6. **Intentar nuevamente**

---

## 🔍 Información de Debug

Para obtener más información sobre el error, actualiza `authService.js`:

```javascript
async register(userData) {
  try {
    console.log('📤 Enviando petición a:', API_ENDPOINTS.REGISTER);
    console.log('📦 Datos:', userData);

    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📥 Respuesta recibida:', response.status);

    const data = await response.json();
    console.log('📊 Data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }

    // ... resto del código
  } catch (error) {
    console.error('❌ Error completo:', error);
    return {
      success: false,
      message: error.message || 'Error de conexión con el servidor'
    };
  }
}
```

Luego revisa la consola del navegador (F12) para ver los logs.

---

**¡Siguiendo estos pasos deberías poder solucionar el error "Failed to fetch"!** 🎉
