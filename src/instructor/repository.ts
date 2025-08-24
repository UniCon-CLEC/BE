import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstructorRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.instructor.findUnique({
      where: { id },
      include: {
        courses: true,
      },
    });
  }
}
