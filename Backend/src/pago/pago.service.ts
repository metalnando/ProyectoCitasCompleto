import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPago, pagoModel } from './schema/pago.schema';
import { PaymentProvider } from '../pago/providers/payment.provider';
import { ProcesarPagoDto } from './dto/procesarPago.dto';
import { FacturasService } from '../facturas/facturas.service';

@Injectable()
export class PagoService {
  constructor(
    @InjectModel(pagoModel.name) private pagoModel: Model<IPago>,
    @Inject('PAYMENT_PROVIDER') private paymentProvider: PaymentProvider,
    private facturaService: FacturasService
  ) {}

  async procesarPago(procesarPagoDto: ProcesarPagoDto): Promise<IPago> {
    const factura = await this.facturaService.obtenerFacturaById(
      procesarPagoDto.facturaId
    );

    if (!factura) {
      throw new Error('Factura no encontrada');
    }

    if (procesarPagoDto.pagoTotal > factura.saldoPendiente) {
      throw new Error('El pago total excede el saldo pendiente');
    }

    let resultadoPago;

    if (procesarPagoDto.metodoPago === 'tarjeta') {
      if (!procesarPagoDto.detallesTarjeta?.token) {
        throw new Error('Token de tarjeta requerido');
      }
      resultadoPago = await this.paymentProvider.procesarPago(
        procesarPagoDto.pagoTotal,
        procesarPagoDto.detallesTarjeta
      );
    } else {
      resultadoPago = { exito: true, transaccionId: `manual-${Date.now()}` };
    }

    if (!resultadoPago.exito) {
      throw new Error('Error al procesar el pago');
    }

    const nuevoPago = new this.pagoModel({
      fecha: new Date(),
      monto: procesarPagoDto.pagoTotal,
      metodoPago: procesarPagoDto.metodoPago,
      estado: 'pago',
      factura: factura._id,
      paciente: procesarPagoDto.pacienteId,
      referencia: procesarPagoDto.referencia || resultadoPago.transaccionId,
      notas: procesarPagoDto.notas,
    });

    const pagoGuardado = await nuevoPago.save();

    if (!pagoGuardado._id) {
      throw new Error('Error al guardar el pago: ID no generado');
    }

    await this.facturaService.actualizarFactura(
      factura._id.toString(),
      pagoGuardado._id.toString(),
      procesarPagoDto.pagoTotal
    );

    return pagoGuardado.populate('factura');
  }

  async getPagosByFacturaId(facturaId: string): Promise<IPago[]> {
    const pagos = this.pagoModel
      .find({ factura: facturaId })
      .populate('factura')
      .populate('paciente')
      .exec();

    if (!pagos || (await pagos).length === 0) {
      throw new HttpException('No se encontraron pagos', HttpStatus.NOT_FOUND);
    }

    return pagos;
  }

  async getPagosByPacienteId(pacienteId: string): Promise<IPago[]> {
    try {
      const pagos = await this.pagoModel
        .find({ paciente: pacienteId })
        .populate('factura')
        .populate('paciente')
        .sort({ fecha: -1 })
        .exec();

      if (!pagos || pagos.length === 0) {
        throw new HttpException(
          'No se encontraron pagos para este paciente',
          HttpStatus.NOT_FOUND
        );
      }

      return pagos;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async actualizarPago(
    pagoId: string,
    actualizarPagoDto: ProcesarPagoDto
  ): Promise<IPago> {
    try {
      const pagoActualizado = await this.pagoModel
        .findByIdAndUpdate(pagoId, actualizarPagoDto, { new: true })
        .populate('factura')
        .populate('paciente')
        .exec();

      if (!pagoActualizado) {
        throw new HttpException('Pago no encontrado', HttpStatus.NOT_FOUND);
      }

      return pagoActualizado;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
