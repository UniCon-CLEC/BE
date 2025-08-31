import { Module } from '@nestjs/common';
import { CourseController } from './controller';
import { CourseService } from './service';
import { PrismaModule } from '../prisma/prisma.module';
import { CourseRepository } from './repository';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
})
export class CourseModule {}
