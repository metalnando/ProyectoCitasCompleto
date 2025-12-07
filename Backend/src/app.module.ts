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
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { HistoriaClinicaModule } from './historia-clinica/historia-clinica.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL!),

    HttpModule,
    CitasModule,
    PacientesModule,
    MedicoModule,
    PagoModule,
    UsuariosModule,
    TratamientoModule,
    FacturasModule,
    AuthModule,
    EstadisticasModule,
    HistoriaClinicaModule,
    NotificationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
