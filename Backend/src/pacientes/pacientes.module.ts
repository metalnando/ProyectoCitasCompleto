import { Module } from '@nestjs/common';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PacienteSchema } from './schemas/pacientes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Paciente', schema: PacienteSchema }]),
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}
