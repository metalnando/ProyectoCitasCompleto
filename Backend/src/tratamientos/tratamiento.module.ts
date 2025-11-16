import { Module } from '@nestjs/common';
import { TratamientoController } from './tratamiento.controller';
import { TratamientoService } from './tratamiento.service';
import { TratamientoModel } from './schema/tratamiento.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([TratamientoModel])],
  controllers: [TratamientoController],
  providers: [TratamientoService],
  exports: [TratamientoService],
})
export class TratamientoModule {}
