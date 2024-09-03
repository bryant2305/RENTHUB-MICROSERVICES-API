import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { PropertyType } from 'src/enums/property.enum';

export class CreatePropertyDto {
  @ApiProperty({ example: 'apartamento con vista al mar' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'buena casa ' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'juan dolio ap #12' })
  @IsString()
  address: string;

  @ApiProperty({ enum: PropertyType, example: 'apartment' })
  @IsEnum(PropertyType)
  propertyType: PropertyType; // esto va con un enum

  @ApiProperty({ example: '50' })
  @IsNumber()
  size: number;

  @ApiProperty({ example: '1' })
  @IsNumber()
  bedrooms: number;

  @ApiProperty({ example: '1' })
  @IsNumber()
  bathrooms: number;

  @ApiProperty({ example: '2' })
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  availability: boolean;

  //   @ApiProperty({ example: '' })
  //   @IsString()
  //   images: number; // falta implementar las imagenes

  @ApiProperty({ example: '1' })
  @IsNumber()
  hostId: number;
}
