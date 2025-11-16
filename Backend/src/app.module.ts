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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //MongooseModule.forRoot('mongodb://localhost:27017/consultorio-medico'),
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
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
