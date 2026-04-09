import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
}

export enum PaymentType {
  MONTHLY = 'monthly',
  COMPETITION = 'competition',
  EQUIPMENT = 'equipment',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paymentDate: Date;

  @Column({
    type: 'varchar',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'varchar',
    default: PaymentType.MONTHLY,
  })
  type: PaymentType;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Player, player => player.payments)
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column({ nullable: true })
  playerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
