import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from 'src/facturas/dto/create-factura.dto';

export class updateTratamientoDto extends PartialType(CreateFacturaDto) {}
