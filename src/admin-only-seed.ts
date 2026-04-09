import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { PlayersService } from './players/players.service';
import { PaymentsService } from './payments/payments.service';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './users/entities/user.entity';

async function adminOnlySeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const playersService = app.get(PlayersService);
  const paymentsService = app.get(PaymentsService);

  console.log('Starting admin-only seed...');

  try {
    // Supprimer tous les paiements
    await paymentsService['paymentsRepository'].clear();
    console.log('All payments cleared');

    // Supprimer tous les joueurs
    await playersService['playersRepository'].clear();
    console.log('All players cleared');

    // Supprimer tous les utilisateurs sauf admin
    await usersService['usersRepository'].delete({ role: UserRole.PARENT });
    console.log('All parent users cleared');

    // Vérifier si l'admin existe, sinon le créer
    const existingAdmin = await usersService['usersRepository'].findOne({ 
      where: { username: 'admin' } 
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = await usersService.create({
        username: 'admin',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@academie.com',
        phone: '0123456789',
        role: UserRole.ADMIN,
      });
      console.log('Admin created:', admin.username);
    } else {
      console.log('Admin already exists:', existingAdmin.username);
    }

    console.log('\n=== COMPTES DE TEST ===');
    console.log('ADMIN SEULEMENT:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\n=== SEUL L\'ADMIN EXISTE ===');

  } catch (error) {
    console.error('Error during admin-only seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

adminOnlySeed()
  .then(() => {
    console.log('Admin-only seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin-only seed failed:', error);
    process.exit(1);
  });
