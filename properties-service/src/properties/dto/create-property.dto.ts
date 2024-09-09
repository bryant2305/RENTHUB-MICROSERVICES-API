import { IsEnum, IsString, IsNumber, IsBoolean } from 'class-validator';
import { PropertyType } from 'src/enums/property.enum';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  size: number;

  @IsNumber()
  bedrooms: number;

  @IsNumber()
  bathrooms: number;

  @IsNumber()
  capacity: number;

  //   @ApiProperty({ example: '' })
  //   @IsString()
  //   images: number; // falta implementar las imagenes

  @IsNumber()
  hostId: number; // esto va con un enum
}
