import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    // Vérifier si le username existe déjà
    const existingUser = await this.usersRepository.findOne({ 
      where: { username: createUserDto.username } 
    });
    
    if (existingUser) {
      throw new Error('Ce nom d\'utilisateur est déjà pris');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    return savedUser as unknown as User;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['players'] });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ 
      where: { id }, 
      relations: ['players'] 
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ 
      where: { username },
      relations: ['players']
    });
  }

  async update(id: number, updateUserDto: any): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createParent(createParentDto: any): Promise<User> {
    return this.create({
      ...createParentDto,
      role: UserRole.PARENT,
    });
  }

  async createAdmin(createAdminDto: any): Promise<User> {
    return this.create({
      ...createAdminDto,
      role: UserRole.ADMIN,
    });
  }
}
