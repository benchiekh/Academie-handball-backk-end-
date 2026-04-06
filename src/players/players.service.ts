import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Payment, PaymentStatus, PaymentType } from '../payments/entities/payment.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

 async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
  const player = this.playersRepository.create({
    ...createPlayerDto,
    birthDate: new Date(createPlayerDto.birthDate), // Conversion ici
  });

  const savedPlayer = await this.playersRepository.save(player);

  // Créer automatiquement des paiements par défaut pour le nouveau joueur
  await this.createDefaultPayments(savedPlayer.id, createPlayerDto.paymentDate);

  return savedPlayer;
}

private async createDefaultPayments(playerId: number, paymentDate?: string): Promise<void> {
  console.log('=== createDefaultPayments called ===');
  console.log('playerId:', playerId);
  console.log('paymentDate:', paymentDate);
  
  const currentDate = new Date();
  const isPaid = paymentDate && paymentDate.trim() !== '';
  
  console.log('isPaid:', isPaid);
  
  const payment = this.paymentsRepository.create({
    player: { id: playerId },
    type: PaymentType.MONTHLY,
    amount: 50,
    description: 'Mensualité',
    dueDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 jours à partir d'aujourd'hui
    status: isPaid ? PaymentStatus.PAID : PaymentStatus.PENDING,
    paymentDate: isPaid ? new Date(paymentDate) : undefined,
  });
  
  console.log('Payment created:', payment);
  
  const savedPayment = await this.paymentsRepository.save(payment);
  console.log('Payment saved:', savedPayment);
}

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find({ relations: ['parent', 'payments'] });
  }

  async findOne(id: number): Promise<Player> {
    return this.playersRepository.findOne({ 
      where: { id }, 
      relations: ['parent', 'payments'] 
    });
  }

  async findByParent(parentId: number): Promise<Player[]> {
    return this.playersRepository.find({ 
      where: { parent: { id: parentId } }, 
      relations: ['payments'] 
    });
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    await this.playersRepository.update(id, updatePlayerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.playersRepository.delete(id);
  }

  async getStats(): Promise<any> {
    const totalPlayers = await this.playersRepository.count();
    const activePlayers = await this.playersRepository.count({ 
      where: { isActive: true } 
    });
    
    return {
      total: totalPlayers,
      active: activePlayers,
      inactive: totalPlayers - activePlayers,
    };
  }
}
