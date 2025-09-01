import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from '../clients/dtos/create.dto';
import { Client } from '../clients/entities/client.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../constants/roles';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createClientDto: CreateClientDto): Promise<Client> {
    const { company_name, contact_email, password } = createClientDto;

    const existingClient = await this.clientRepository.findOne({
      where: [{ company_name }, { contact_email }],
    });

    if (existingClient) {
      throw new ConflictException(
        'Client with given name or email already exists',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const client = this.clientRepository.create({
      ...createClientDto,
      password: hashedPassword,
      role: Role.Client,
    });

    return this.clientRepository.save(client);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    //select password field explicitly
    const client = await this.clientRepository.findOne({
      where: { contact_email: email },
      select: ['id', 'contact_email', 'password', 'role'],
    });

    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: client.id,
      email: client.contact_email,
      role: client.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
