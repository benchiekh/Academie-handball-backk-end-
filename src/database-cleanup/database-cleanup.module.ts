import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseCleanupService } from './database-cleanup.service';
import { User } from '../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Player, Payment]),
  ],
  providers: [DatabaseCleanupService],
  exports: [DatabaseCleanupService],
})
export class DatabaseCleanupModule {}
