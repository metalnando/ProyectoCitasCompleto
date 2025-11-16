import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { usuariosSchema, UserModel } from '../usuarios/schema/usuarios.schema';
import { CitasSchema, citasModel } from '../citas/Schema/citas.schema';
import { medicoModel, medicoSchema } from '../medico/schema/medico.schema';
import { TratamientoModel, tratamientoSchema } from '../tratamientos/schema/tratamiento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: usuariosSchema },
      { name: citasModel.name, schema: CitasSchema },
      { name: medicoModel.name, schema: medicoSchema },
      { name: TratamientoModel.name, schema: tratamientoSchema },
    ]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
