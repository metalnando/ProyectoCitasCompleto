import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import { PagoService } from './pago.service';
import { ProcesarPagoDto } from './dto/procesarPago.dto';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('procesar')
  async procesarPago(@Body() procesarPagoDto: ProcesarPagoDto) {
    return this.pagoService.procesarPago(procesarPagoDto);
  }

  @Get('factura/:facturaId')
  async getPagosByFacturaId(@Param('facturaId') facturaId: string) {
    return this.pagoService.getPagosByFacturaId(facturaId);
  }

  @Get('paciente/:pacienteId')
  async getPagosByPacienteId(@Param('pacienteId') pacienteId: string) {
    return this.pagoService.getPagosByPacienteId(pacienteId);
  }

  @Put(':id')
  async actualizarPago(
    @Param('id') id: string,
    @Body() actualizarPagoDto: ProcesarPagoDto
  ) {
    return this.pagoService.actualizarPago(id, actualizarPagoDto);
  }
}
