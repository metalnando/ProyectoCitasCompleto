import { forwardRef, Module } from '@nestjs/common';
import { PagoController } from './pago.controller';
import { PagoService } from './pago.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { pagoModel } from './schema/pago.schema';
import { FacturasModule } from 'src/facturas/facturas.module';
import { StripePaymentProvider } from './providers/stripe.payment.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([pagoModel]),
    forwardRef(() => FacturasModule),
  ],
  controllers: [PagoController],
  providers: [
    PagoService,
    {
      provide: 'PAYMENT_PROVIDER',
      useClass: StripePaymentProvider,
    },
  ],
  exports: [PagoService, MongooseModule.forFeature([pagoModel])],
})
export class PagoModule {}
