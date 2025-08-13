import { Module } from '@nestjs/common';
import { MeController } from './controller';
import { MeService } from './service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [
    MeService, 
    PrismaService
  ],
  controllers: [MeController],
})
export class MeModule {}