import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
