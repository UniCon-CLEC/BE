
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InstructorController } from './controller';
import { InstructorService } from './service';
import { InstructorRepository } from './repository';

@Module({
  imports: [PrismaModule],
  controllers: [InstructorController],
  providers: [InstructorService, InstructorRepository],
})
export class InstructorModule {}
