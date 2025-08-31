import { NestFactory } from '@nestjs/core';
import { AppModule } from '../module';
import { PrismaService } from '../prisma/prisma.service';
import { seedInstructors } from './seeders/instructor';
import { seedTrack } from './seeders/track';
import { seedCrew } from './seeders/crew';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  try {
    await seed(prisma);
    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

async function seed(prisma: PrismaService) {
  await prisma.$transaction(async (tx) => {
    const instructor = await seedInstructors(tx);
    await seedTrack(tx, instructor);
    await seedCrew(tx, instructor);
  });
}

bootstrap();
