import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HistoriaClinicaService } from './historia-clinica.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('historia-clinica')
@UseGuards(JwtAuthGuard)
export class HistoriaClinicaController {
  constructor(
    private readonly historiaClinicaService: HistoriaClinicaService
  ) {}

  @Post()
  async create(@Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return this.historiaClinicaService.create(createHistoriaClinicaDto);
  }

  @Post('con-imagenes')
  @UseInterceptors(
    FilesInterceptor('imagenes', 10, {
      storage: diskStorage({
        destination: './uploads/historias',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `historia-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(new Error('Solo se permiten imágenes y PDFs'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })
  )
  async createConImagenes(
    @Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    if (files && files.length > 0) {
      createHistoriaClinicaDto.imagenes = files.map((file) => ({
        url: `/uploads/historias/${file.filename}`,
        descripcion: '',
      }));
    }
    return this.historiaClinicaService.create(createHistoriaClinicaDto);
  }

  @Get()
  async findAll() {
    return this.historiaClinicaService.findAll();
  }

  @Get('paciente/:pacienteId')
  async findByPaciente(@Param('pacienteId') pacienteId: string) {
    return this.historiaClinicaService.findByPaciente(pacienteId);
  }

  @Get('medico/:medicoId')
  async findByMedico(@Param('medicoId') medicoId: string) {
    return this.historiaClinicaService.findByMedico(medicoId);
  }

  @Get('cita/:citaId')
  async findByCita(@Param('citaId') citaId: string) {
    return this.historiaClinicaService.findByCita(citaId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.historiaClinicaService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateHistoriaClinicaDto>
  ) {
    return this.historiaClinicaService.update(id, updateData);
  }

  @Post(':id/imagenes')
  @UseInterceptors(
    FilesInterceptor('imagenes', 5, {
      storage: diskStorage({
        destination: './uploads/historias',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `historia-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
          return cb(new Error('Solo se permiten imágenes y PDFs'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, //  10MB
      },
    })
  )
  async addImagenes(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { descripciones?: string[] }
  ) {
    let historia = await this.historiaClinicaService.findById(id);

    for (let i = 0; i < files.length; i++) {
      const imagen = {
        url: `/uploads/historias/${files[i].filename}`,
        descripcion: body.descripciones?.[i] || '',
      };
      historia = await this.historiaClinicaService.addImagen(id, imagen);
    }

    return historia;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.historiaClinicaService.delete(id);
  }
}
