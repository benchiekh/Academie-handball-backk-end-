import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    
    // Afficher le token dans les logs pour Postman
    console.log('=== LOGIN SUCCESS ===');
    console.log('Username:', loginDto.username);
    console.log('Token for Postman:', result.access_token);
    console.log('Bearer Token:', `Bearer ${result.access_token}`);
    console.log('===================');
    
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
