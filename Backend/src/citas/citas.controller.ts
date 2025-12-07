import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { ICitas } from './Schema/citas.schema';
import { CrearCitaDto } from './dto/crear-cita.dto';
import { PacienteExistentePipe } from './pipes/pacienteExistente.pipe';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('citas')
@UseGuards(JwtAuthGuard)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  async create(
    @Body() crearCitaDto: CrearCitaDto,
    @Body('pacienteDocumento', PacienteExistentePipe)
    pacienteId: Types.ObjectId
  ) {
    const citaCreada = { ...crearCitaDto, paciente: pacienteId };
    return await this.citasService.crearCita(citaCreada);
  }

  @Get()
  async getAllCitas() {
    return this.citasService.getCitas();
  }

  @Get('historial/:pacienteId')
  async getHistorialByPaciente(@Param('pacienteId') pacienteId: string) {
    return this.citasService.getHistorialByPaciente(pacienteId);
  }

  @Get('medico/:medicoId')
  async getCitasByMedico(
    @Param('medicoId') medicoId: string,
    @Query('fecha') fecha?: string
  ) {
    return this.citasService.getCitasByMedico(medicoId, fecha);
  }

  @Get('horas-ocupadas/:medicoId')
  async getHorasOcupadas(
    @Param('medicoId') medicoId: string,
    @Query('fecha') fecha: string
  ) {
    const citas = await this.citasService.getCitasByMedico(medicoId, fecha);
    const horasOcupadas = citas
      .filter((cita) => cita.estado !== 'cancelada')
      .map((cita) => cita.hora);
    return { horasOcupadas };
  }

  @Get('estado/:estado')
  async getCitasByEstado(@Param('estado') estado: string) {
    return this.citasService.getCitasByEstado(estado);
  }

  @Get('usuario/:userId')
  async getCitasByUsuario(@Param('userId') userId: string) {
    return this.citasService.getCitasByUsuario(userId);
  }

  @Put(':id/estado')
  async updateEstadoCita(
    @Param('id') id: string,
    @Body('estado') estado: string
  ) {
    return this.citasService.updateEstadoCita(id, estado);
  }

  //Buscar Cita por ID
  @Get(':id')
  async getCitaById(@Param('id') id: string): Promise<ICitas> {
    const cita = await this.citasService.getCitaById(id);
    if (!cita) {
      throw new HttpException('Cita no encontrada', HttpStatus.NOT_FOUND);
    }
    return cita;
  }

  // Actualizar las citas
  @Put(':id')
  async actualizarCita(
    @Param('id') id: string,
    @Body() crearCitaDto: CrearCitaDto
  ): Promise<ICitas> {
    return await this.citasService.updateCita(id, crearCitaDto);
  }

  // Actualización parcial de cita (para duración, consultorio, etc.)
  @Put(':id/parcial')
  async actualizarCitaParcial(
    @Param('id') id: string,
    @Body() updateData: Partial<CrearCitaDto>
  ): Promise<ICitas> {
    return await this.citasService.updateCitaParcial(id, updateData);
  }

  //Eliminar cita (eliminación lógica)
  @Delete(':id')
  async deleteCita(@Param('id') id: string): Promise<ICitas> {
    return await this.citasService.deleteCita(id);
  }

  // Eliminación física (solo para administradores)
  @Delete(':id/fisica')
  async eliminarCitaFisicamente(@Param('id') id: string): Promise<ICitas> {
    return await this.citasService.eliminarCitaFisicamente(id);
  }

  // Registrar pago de cita
  @Put(':id/pagar')
  async registrarPago(
    @Param('id') id: string,
    @Body('metodoPago') metodoPago: string,
    @Body('comprobantePago') comprobantePago?: string
  ): Promise<ICitas> {
    return await this.citasService.registrarPago(
      id,
      metodoPago,
      comprobantePago
    );
  }
}
