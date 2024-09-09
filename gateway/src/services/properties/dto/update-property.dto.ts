import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from 'src/enums/property.enum';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @ApiProperty({
    example: 'apartamento con vista al mar',
    description: 'Título de la propiedad',
  })
  title?: string;

  @ApiProperty({
    example: 'buena casa ',
    description: 'Descripción de la propiedad',
  })
  description?: string;

  @ApiProperty({
    example: 'juan dolio ap #12',
    description: 'Dirección de la propiedad',
  })
  address?: string;

  @ApiProperty({
    enum: PropertyType,
    example: 'apartment',
    description: 'Tipo de propiedad',
  })
  propertyType?: PropertyType;

  @ApiProperty({ example: '50', description: 'Tamaño de la propiedad' })
  size?: number;

  @ApiProperty({ example: '1', description: 'Número de habitaciones' })
  bedrooms?: number;

  @ApiProperty({ example: '1', description: 'Número de baños' })
  bathrooms?: number;

  @ApiProperty({ example: '2', description: 'Capacidad de la propiedad' })
  capacity?: number;
}
