import { Injectable } from '@nestjs/common';
import { PaymentProvider, PaymentResult } from './payment.provider';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripePaymentProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY no está configurada en las variables de entorno'
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async procesarPago(monto: number, detalles: any): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(monto * 100),
        currency: 'cop',
        payment_method: detalles.token,
        confirm: true,
      });

      return {
        exito: paymentIntent.status === 'succeeded',
        transaccionId: paymentIntent.id,
      };
    } catch (error) {
      return {
        exito: false,
        transaccionId: `error-${Date.now()}`,
        mensaje: error.message,
      };
    }
  }
}
