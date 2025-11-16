import { Controller, Get, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get()
  async obtenerEstadisticasGenerales() {
    return this.estadisticasService.obtenerEstadisticasGenerales();
  }

  @Get('tratamientos-populares')
  async obtenerTratamientosPopulares() {
    return this.estadisticasService.obtenerTratamientosPopulares();
  }

  @Get('usuarios')
  async obtenerUsuarios() {
    return this.estadisticasService.obtenerUsuariosDetalle();
  }

  @Get('citas')
  async obtenerCitas() {
    return this.estadisticasService.obtenerCitasDetalle();
  }

  @Get('citas-pendientes')
  async obtenerCitasPendientes() {
    return this.estadisticasService.obtenerCitasPendientesDetalle();
  }
}
