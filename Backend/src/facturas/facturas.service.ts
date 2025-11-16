import { Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import mongoose, { Model } from 'mongoose';
import { facturaModel, Ifactura } from 'src/facturas/schema/factura.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IPago, pagoModel } from 'src/pago/schema/pago.schema';
import { Types } from 'mongoose';

@Injectable()
export class FacturasService {
  constructor(
    @InjectModel(facturaModel.name) private facturaModel: Model<Ifactura>,
    @InjectModel(pagoModel.name) private pagoModel: Model<IPago>
  ) {}

  async createFactura(createFacturaDto: CreateFacturaDto): Promise<Ifactura> {
    const factura = new this.facturaModel({
      ...CreateFacturaDto,
      fechaEmision: new Date(),
      total: createFacturaDto.total,
      saldoPendiente: createFacturaDto.saldoPendiente,
      estado: 'pendiente',
      paciente: createFacturaDto.pacienteId,
      tratamiento: createFacturaDto.tratamientoId,
      cita: createFacturaDto.citaId,
      descripcion: createFacturaDto.descripcion,
      notas: createFacturaDto.notas,
    });
    return factura.save();
  }

  // Obtener factura por ID

  async obtenerFacturaById(id: string): Promise<Ifactura> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de factura no válido');
    }
    const factura = await this.facturaModel
      .findById(id)
      .populate('pagos')
      .populate('paciente')
      .populate('tratamiento')
      .populate('cita')
      .exec();
    if (!factura) {
      throw new Error(`La factura con el ID ${id} no existe`);
    }
    return factura;
  }

  async actualizarFactura(facturaId: string, pagoId: string, total: number) {
    const factura = await this.facturaModel.findById(facturaId).exec();
    if (!mongoose.Types.ObjectId.isValid(facturaId)) {
      throw new Error('Factura no encontrada');
    }
    if (!mongoose.Types.ObjectId.isValid(pagoId)) {
      throw new Error('Pago no encontrado');
    }
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    const nuevoSaldo = factura.saldoPendiente - total;
    const nuevoEstado = this.EstadoFactura(factura.total, nuevoSaldo);

    return this.facturaModel
      .findByIdAndUpdate(
        facturaId,
        {
          $push: { pagos: pagoId },
          saldoPendiente: nuevoSaldo,
          estado: nuevoEstado,
        },
        { new: true }
      )
      .exec();
  }

  private EstadoFactura(total: number, saldoPendiente: number): string {
    if (saldoPendiente === 0) {
      return 'pagada';
    } else if (saldoPendiente < total) {
      return 'Tiene Saldo Pendiente';
    } else {
      return 'Pendiente';
    }
  }

  async obtenerFacturaPorPaciente(pacienteId: string): Promise<any[]> {
    const facturas = await this.facturaModel
      .find({ paciente: pacienteId })
      .populate('pagos') // Población de pagos
      .populate('tratamiento')
      .populate('cita')
      .sort({ fechaEmision: -1 })
      .lean() // Convierte a objeto JSON plano
      .exec();

    if (!facturas.length) {
      throw new Error('No se encontraron facturas para este paciente');
    }

    return facturas;
  }

  async obtenerFacturas(): Promise<any[]> {
    return this.facturaModel
      .find()
      .populate('pagos')
      .populate('paciente')
      .populate('tratamiento')
      .populate('cita')
      .lean() // Convierte a objeto JSON plano
      .exec();
  }
}
