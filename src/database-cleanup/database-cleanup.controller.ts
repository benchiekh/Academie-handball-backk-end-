import { Controller, Get, Post } from '@nestjs/common';
import { DatabaseCleanupService } from './database-cleanup.service';

@Controller('database-cleanup')
export class DatabaseCleanupController {
  constructor(private readonly databaseCleanupService: DatabaseCleanupService) {}

  @Post('cleanup')
  async cleanupDatabase() {
    return await this.databaseCleanupService.cleanupDatabase();
  }

  @Get('status')
  async getDatabaseStatus() {
    return { message: 'Endpoint de nettoyage disponible' };
  }
}
