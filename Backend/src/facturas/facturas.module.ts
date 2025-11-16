import { forwardRef, Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { facturaModel } from './schema/factura.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PagoModule } from 'src/pago/pago.module';
import { pagoModel } from 'src/pago/schema/pago.schema';
import { PagoService } from 'src/pago/pago.service';
import { TratamientoModel } from 'src/tratamientos/schema/tratamiento.schema';
import { citasModel, CitasSchema } from 'src/citas/Schema/citas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      facturaModel,
      pagoModel,
      TratamientoModel,
      { name: citasModel.name, schema: CitasSchema },
    ]),
    forwardRef(() => PagoModule),
  ],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService],
})
export class FacturasModule {}
