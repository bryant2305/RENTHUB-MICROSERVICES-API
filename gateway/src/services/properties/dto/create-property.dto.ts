import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'jonh' })
  @IsString()
  name: string;
}
