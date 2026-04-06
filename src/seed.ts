import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { PlayersService } from './players/players.service';
import { PaymentsService } from './payments/payments.service';
import * as bcrypt from 'bcryptjs';
import { PaymentStatus, PaymentType } from './payments/entities/payment.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const playersService = app.get(PlayersService);
  const paymentsService = app.get(PaymentsService);

  console.log('Starting seed...');

  try {
    // Créer un admin
    const adminPassword = await bcrypt.hash('admin', 10);
    const admin = await usersService.create({
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@academie.com',
      phone: '0123456789',
      role: 'admin',
    });
    console.log('Admin created:', admin.username);

    // Créer des parents
    const parentPassword = await bcrypt.hash('parent', 10);
    const parent1 = await usersService.create({
      username: 'parent1',
      password: parentPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '0123456789',
      role: 'parent',
    });

    const parent2 = await usersService.create({
      username: 'parent2',
      password: parentPassword,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      phone: '0987654321',
      role: 'parent',
    });

    console.log('Parents created:', parent1.username, parent2.username);

    // Créer des joueurs pour parent1
    const player1 = await playersService.create({
      firstName: 'Lucas',
      lastName: 'Dupont',
      birthDate: new Date('2010-05-15'),
      height: 145,
      weight: 40,
      position: 'Ailier gauche',
      isActive: true,
      parentId: parent1.id,
    });

    const player2 = await playersService.create({
      firstName: 'Emma',
      lastName: 'Dupont',
      birthDate: new Date('2012-08-22'),
      height: 135,
      weight: 32,
      position: 'Demi-centre',
      isActive: true,
      parentId: parent1.id,
    });

    // Créer des joueurs pour parent2
    const player3 = await playersService.create({
      firstName: 'Hugo',
      lastName: 'Martin',
      birthDate: new Date('2011-03-10'),
      height: 140,
      weight: 38,
      position: 'Arrière gauche',
      isActive: true,
      parentId: parent2.id,
    });

    console.log('Players created:', player1.firstName, player2.firstName, player3.firstName);

    // Créer des paiements
    const currentDate = new Date();
    
    // Paiements pour Lucas Dupont
    for (let i = 0; i < 6; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setMonth(currentDate.getMonth() - i);
      
      await paymentsService.create({
        amount: 50,
        dueDate: dueDate.toISOString().split('T')[0],
        status: i < 3 ? PaymentStatus.PAID : i === 3 ? PaymentStatus.PENDING : PaymentStatus.OVERDUE,
        type: PaymentType.MONTHLY,
        description: `Mensualité ${dueDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        playerId: player1.id,
      });
    }

    // Paiements pour Emma Dupont
    for (let i = 0; i < 6; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setMonth(currentDate.getMonth() - i);
      
      await paymentsService.create({
        amount: 50,
        dueDate: dueDate.toISOString().split('T')[0],
        status: i < 4 ? PaymentStatus.PAID : PaymentStatus.PENDING,
        type: PaymentType.MONTHLY,
        description: `Mensualité ${dueDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        playerId: player2.id,
      });
    }

    // Paiements pour Hugo Martin
    for (let i = 0; i < 6; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setMonth(currentDate.getMonth() - i);
      
      await paymentsService.create({
        amount: 50,
        dueDate: dueDate.toISOString().split('T')[0],
        status: i < 2 ? PaymentStatus.PAID : i === 2 ? PaymentStatus.PENDING : PaymentStatus.OVERDUE,
        type: PaymentType.MONTHLY,
        description: `Mensualité ${dueDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        playerId: player3.id,
      });
    }

    // Ajouter quelques paiements de compétition
    await paymentsService.create({
      amount: 25,
      dueDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dans 1 semaine
      status: PaymentStatus.PENDING,
      type: PaymentType.COMPETITION,
      description: 'Tournoi régional',
      playerId: player1.id,
    });

    await paymentsService.create({
      amount: 30,
      dueDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dans 2 semaines
      status: PaymentStatus.PENDING,
      type: PaymentType.COMPETITION,
      description: 'Tournoi départemental',
      playerId: player2.id,
    });

    console.log('Payments created successfully!');

    console.log('\n=== COMPTES DE TEST ===');
    console.log('ADMIN:');
    console.log('  Username: admin');
    console.log('  Password: admin');
    console.log('\nPARENT 1:');
    console.log('  Username: parent1');
    console.log('  Password: parent');
    console.log('\nPARENT 2:');
    console.log('  Username: parent2');
    console.log('  Password: parent');
    console.log('========================\n');

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
