import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create.dto';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
