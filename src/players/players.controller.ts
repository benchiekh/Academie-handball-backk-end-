import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DateValidationPipe } from '../common/pipes/date-validation.pipe';

@Controller('players')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createPlayerDto: CreatePlayerDto, @Request() req: any) {
    console.log('=== CREATE PLAYER REQUEST ===');
    console.log('Received data:', createPlayerDto);
    console.log('birthDate type:', typeof createPlayerDto.birthDate);
    console.log('birthDate value:', createPlayerDto.birthDate);
    
    try {
      const result = this.playersService.create(createPlayerDto);
      console.log('✅ PlayersController.create: success');
      return result;
    } catch (error) {
      console.error('❌ PlayersController.create: error:', error);
      throw error;
    }
  }

  @Post('my-player')
  @UseGuards(JwtAuthGuard)
  createMyPlayer(@Body() createPlayerDto: CreatePlayerDto, @Request() req: any) {
    return this.playersService.create({
      ...createPlayerDto,
      parentId: req.user.sub,
    });
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Get('my-players')
  findMyPlayers(@Request() req) {
    return this.playersService.findByParent(req.user.id);
  }

  @Get('stats')
  @Roles('admin')
  getStats() {
    return this.playersService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
