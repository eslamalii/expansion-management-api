import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dtos/create.dto';
import * as bcrypt from 'bcrypt';
import { UpdateClientDto } from './dtos/update.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createClientDto.password, salt);

    const client = this.clientsRepository.create({
      ...createClientDto,
      password: hashedPassword,
    });

    return this.clientsRepository.save(client);
  }

  findAll(): Promise<Client[]> {
    return this.clientsRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    if (updateClientDto.password) {
      const salt = await bcrypt.genSalt();
      client.password = await bcrypt.hash(updateClientDto.password, salt);
    }

    return this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<{ message: string }> {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
    return { message: 'Client deleted successfully' };
  }
}
