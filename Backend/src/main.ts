import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:5174',
      ];
  // Configuración CORS
  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000',
  //     'http://localhost:3001',
  //     'http://localhost:5173', // Puerto de Vite para el frontend
  //     'http://localhost:5174',
  //   ],
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  // });
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, mobile apps)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Normalizar URLs removiendo trailing slashes
      const normalizedOrigin = origin.replace(/\/$/, '');
      const normalizedAllowedOrigins = allowedOrigins.map((o) =>
        o.replace(/\/$/, '')
      );

      if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Servir archivos estáticos (imágenes de médicos)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe());
  // await app.listen(3000);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend Corriendo en el puerto: ${port}`);
  console.log(`🌍 Origenes de CORS permitidos: ${allowedOrigins.join(', ')}`);
}
bootstrap();
