import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoriaClinicaController } from './historia-clinica.controller';
import { HistoriaClinicaService } from './historia-clinica.service';
import { historiaClinicaModel } from './schema/historia-clinica.schema';
import { PacienteSchema } from '../pacientes/schemas/pacientes.schema';
import { medicoSchema } from '../medico/schema/medico.schema';
import { CitasSchema } from '../citas/Schema/citas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: historiaClinicaModel.name,
        schema: historiaClinicaModel.schema,
      },
      {
        name: 'Paciente',
        schema: PacienteSchema,
      },
      {
        name: 'Medicos',
        schema: medicoSchema,
      },
      {
        name: 'Citas',
        schema: CitasSchema,
      },
    ]),
  ],
  controllers: [HistoriaClinicaController],
  providers: [HistoriaClinicaService],
  exports: [HistoriaClinicaService],
})
export class HistoriaClinicaModule {}
