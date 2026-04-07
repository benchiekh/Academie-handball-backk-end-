import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class DatabaseCleanupService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async cleanupDatabase(): Promise<{ message: string; deletedCounts: any }> {
    try {
      // 1. Compter avant suppression
      const userCount = await this.usersRepository.count();
      const playerCount = await this.playersRepository.count();
      const paymentCount = await this.paymentsRepository.count();

      // 2. Supprimer tous les paiements
      await this.paymentsRepository.delete({});

      // 3. Supprimer tous les joueurs
      await this.playersRepository.delete({});

      // 4. Supprimer tous les utilisateurs sauf les admins
      await this.usersRepository.delete({ role: 'parent' as any });

      // 5. Compter après suppression
      const remainingUsers = await this.usersRepository.count();
      const remainingPlayers = await this.playersRepository.count();
      const remainingPayments = await this.paymentsRepository.count();

      return {
        message: 'Base de données nettoyée avec succès',
        deletedCounts: {
          users: userCount - remainingUsers,
          players: playerCount,
          payments: paymentCount,
          remainingUsers,
          remainingPlayers,
          remainingPayments
        }
      };
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      throw error;
    }
  }
}
