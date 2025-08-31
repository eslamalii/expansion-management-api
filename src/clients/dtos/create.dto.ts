import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsEmail()
  contact_email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password is too short. Minimum length is 8 characters.',
  })
  password: string;
}
