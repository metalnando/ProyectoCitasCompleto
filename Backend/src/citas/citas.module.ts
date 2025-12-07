import { Module } from '@nestjs/common';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { citasModel, CitasSchema } from './Schema/citas.schema';
import {
  pacienteModel,
  PacienteSchema,
} from 'src/pacientes/schemas/pacientes.schema';
import { UserModel, usuariosSchema } from 'src/usuarios/schema/usuarios.schema';
import { medicoModel, medicoSchema } from 'src/medico/schema/medico.schema';
import { tratamientoSchema } from 'src/tratamientos/schema/tratamiento.schema';
import { PacienteExistentePipe } from './pipes/pacienteExistente.pipe';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: citasModel.name, schema: CitasSchema },
      { name: pacienteModel.name, schema: PacienteSchema },
      { name: UserModel.name, schema: usuariosSchema },
      { name: medicoModel.name, schema: medicoSchema },
      { name: 'Tratamiento', schema: tratamientoSchema },
    ]), //'citas.name '
    NotificationsModule,
  ],
  controllers: [CitasController],
  providers: [CitasService, PacienteExistentePipe],
  exports: [CitasService],
})
export class CitasModule {}
