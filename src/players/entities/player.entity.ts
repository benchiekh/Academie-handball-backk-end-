import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column()
  position: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.players)
  @JoinColumn({ name: 'parentId' }) // Spécifie la colonne étrangère
  parent: User;

  @Column({ nullable: true }) // Colonne parentId explicite
  parentId: number;

  @OneToMany(() => Payment, payment => payment.player)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
