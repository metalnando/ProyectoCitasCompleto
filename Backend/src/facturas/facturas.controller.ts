import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  async crearFactura(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.createFactura(createFacturaDto);
  }

  @Get('paciente/:pacienteId')
  async obtenerFacturasPorPaciente(@Param('pacienteId') pacienteId: string) {
    return this.facturasService.obtenerFacturaPorPaciente(pacienteId);
  }

  @Get(':id')
  async obtenerFactura(@Param('id') id: string) {
    return this.facturasService.obtenerFacturaById(id);
  }

  @Get()
  async obtenerFacturas() {
    return this.facturasService.obtenerFacturas();
  }
}
