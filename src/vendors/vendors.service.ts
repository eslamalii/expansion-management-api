import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { CreateVendorDto } from './dtos/create.dto';
import { UpdateVendorDto } from './dtos/update.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find();
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.vendorRepository.preload({
      id,
      ...updateVendorDto,
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return this.vendorRepository.save(vendor);
  }

  async remove(id: number): Promise<{ message: string }> {
    const vendor = await this.findOne(id);
    await this.vendorRepository.remove(vendor);
    return { message: `Vendor with ID ${id} has been removed` };
  }
}
