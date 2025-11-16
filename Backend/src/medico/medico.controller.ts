import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MedicoService } from './medico.service';
import { createMedicoDto } from './dto/crear-medico.dto';
import { IMedico } from './schema/medico.schema';

@Controller('/medico')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/medicos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `medico-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async createMedico(
    @Body() createMedicoDto: createMedicoDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      createMedicoDto.imagen = `/uploads/medicos/${file.filename}`;
    }
    return this.medicoService.createMedico(createMedicoDto);
  }

  // Buscar todos los medicos
  @Get()
  async getAllMedicos() {
    return this.medicoService.getMedicos();
  }

  // Buscar un medico por id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<IMedico | null> {
    const medico = await this.medicoService.findById(id);
    if (!medico) {
      throw new NotFoundException('Medico no encontrado en la Base de datos');
    }
    return medico;
  }

  //Actualizar MEdico por Id
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/medicos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `medico-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async updateMedico(
    @Param('id') id: string,
    @Body() createMedicoDto: createMedicoDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<IMedico> {
    if (file) {
      createMedicoDto.imagen = `/uploads/medicos/${file.filename}`;
    }
    return this.medicoService.updateMedico(id, createMedicoDto);
  }

  // Eliminar medico por id
  @Delete(':id')
  async deleteMedico(@Param('id') id: string): Promise<IMedico> {
    return await this.medicoService.deleteMedico(id);
  }
}
