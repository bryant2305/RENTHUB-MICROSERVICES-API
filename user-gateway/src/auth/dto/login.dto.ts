import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'youremail@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'yourpassword' })
  @MinLength(6)
  password: string;
}
