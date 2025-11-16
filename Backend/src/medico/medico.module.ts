import { Module } from '@nestjs/common';
import { MedicoController } from './medico.controller';
import { MedicoService } from './medico.service';
import { MongooseModule } from '@nestjs/mongoose';
import { medicoModel } from './schema/medico.schema';

@Module({
  imports: [MongooseModule.forFeature([medicoModel])],
  controllers: [MedicoController],
  providers: [MedicoService],
  exports: [MedicoService],
})
export class MedicoModule {}
