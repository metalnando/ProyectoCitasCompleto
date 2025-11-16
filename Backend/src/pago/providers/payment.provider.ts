export interface PaymentResult {
  exito: boolean;
  transaccionId: string;
  mensaje?: string;
}

export abstract class PaymentProvider {
  abstract procesarPago(monto: number, detalles: any): Promise<PaymentResult>;
}
