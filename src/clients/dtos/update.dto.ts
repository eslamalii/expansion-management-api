import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {}
