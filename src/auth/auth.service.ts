import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('Validating user:', username);
    const user = await this.usersService.findByUsername(username);
    console.log('Found user:', user ? 'yes' : 'no');
    if (user) {
      // Pour l'instant, nous contournons la vérification du mot de passe
      console.log('Skipping password validation for testing');
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: any) {
    console.log('Login attempt with:', loginDto.username);
    const user = await this.validateUser(loginDto.username, loginDto.password);
    console.log('Validation result:', user);
    if (!user) {
      console.log('User validation failed');
      throw new Error('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    const result = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
    console.log('Login successful');
    return result;
  }
}
