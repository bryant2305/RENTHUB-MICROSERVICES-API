import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @ApiProperty({ example: 'ellocomiolaaplica@gmail.com' })
  email: string;
}
