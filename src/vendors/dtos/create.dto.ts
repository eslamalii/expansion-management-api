import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  countries_supported: string[];

  @IsArray()
  @IsString({ each: true })
  services_offered: string[];

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  @Min(1)
  response_sla_hours?: number;
}
