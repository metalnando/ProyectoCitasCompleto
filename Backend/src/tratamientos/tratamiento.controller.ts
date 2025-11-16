import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TratamientoService } from './tratamiento.service';

import { createTratamientoDto } from './dto/createTratamiento.dto';
import { create } from 'domain';

@Controller('tratamientos')
export class TratamientoController {
  constructor(private readonly tratamientoService: TratamientoService) {}

  @Post()
  async crearTratamiento(@Body() createTratamientoDto: createTratamientoDto) {
    return this.tratamientoService.crearTratamiento(createTratamientoDto);
  }

  @Get(':id')
  async obtenerTratamiento(@Param('id') id: string) {
    return this.tratamientoService.findOne(id);
  }

  @Get()
  async obtenerTratamientos() {
    return this.tratamientoService.findAll();
  }

  @Get()
  async obtenerTratamientosActivos(@Query('activo') activo?: boolean) {
    return this.tratamientoService.findAll(activo);
  }

  @Put(':id')
  async actualizarTratamiento(
    @Param('id') id: string,
    @Body() createTratamientoDto: createTratamientoDto
  ) {
    return this.tratamientoService.update(id, createTratamientoDto);
  }

  @Patch(':id')
  async actualizarTratamientoPatch(
    @Param('id') id: string,
    @Body() createTratamientoDto: createTratamientoDto
  ) {
    return this.tratamientoService.update(id, createTratamientoDto);
  }

  @Delete('id')
  async eliminarTratamiento(@Param('id') id: string) {
    return this.tratamientoService.delete(id);
  }
}
