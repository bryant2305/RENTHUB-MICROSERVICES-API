import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'ellocomiolaaplica@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'ellocomiolaaplica' })
  @MinLength(6)
  password: string;
}
