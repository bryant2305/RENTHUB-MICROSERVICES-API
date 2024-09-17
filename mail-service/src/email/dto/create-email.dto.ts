import { IsEmail, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
