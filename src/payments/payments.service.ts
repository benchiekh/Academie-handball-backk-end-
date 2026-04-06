import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const paymentData = {
        ...createPaymentDto,
        dueDate: new Date(createPaymentDto.dueDate),
      };
      
      // Vérifier que la date est valide
      if (isNaN(paymentData.dueDate.getTime())) {
        throw new Error('Date d\'échéance invalide');
      }
      
      const payment = this.paymentsRepository.create(paymentData);
      return this.paymentsRepository.save(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['player'] });
  }

  async findOne(id: number): Promise<Payment> {
    return this.paymentsRepository.findOne({ 
      where: { id }, 
      relations: ['player'] 
    });
  }

  async findByPlayer(playerId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({ 
      where: { player: { id: playerId } }, 
      relations: ['player'] 
    });
  }

  async findByParent(parentId: number): Promise<Payment[]> {
    return this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.player', 'player')
      .leftJoinAndSelect('player.parent', 'parent')
      .where('parent.id = :parentId', { parentId })
      .getMany();
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    await this.paymentsRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async markAsPaid(id: number): Promise<Payment> {
    await this.paymentsRepository.update(id, { 
      status: PaymentStatus.PAID,
      paymentDate: new Date()
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.paymentsRepository.delete(id);
  }

  async getStats(): Promise<any> {
    const total = await this.paymentsRepository.count();
    const paid = await this.paymentsRepository.count({ 
      where: { status: PaymentStatus.PAID } 
    });
    const pending = await this.paymentsRepository.count({ 
      where: { status: PaymentStatus.PENDING } 
    });
    const overdue = await this.paymentsRepository.count({ 
      where: { status: PaymentStatus.OVERDUE } 
    });

    const totalRevenue = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    return {
      total,
      paid,
      pending,
      overdue,
      totalRevenue: totalRevenue.total || 0,
    };
  }

  async generateMonthlyPayments(): Promise<Payment[]> {
    // Cette méthode pourrait être appelée chaque mois pour générer les paiements mensuels
    const currentMonth = new Date();
    currentMonth.setDate(1); // Premier jour du mois
    
    // Logique pour générer les paiements pour tous les joueurs actifs
    // À implémenter selon les besoins
    return [];
  }
}
