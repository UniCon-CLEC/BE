import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyDto } from '../dto';

@Injectable()
export class CreateSurveyResponseUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    createSurveyDto: CreateSurveyDto,
    userId: string,
  ): Promise<void> {
    await this.prisma.survey.create({
      data: {
        ...createSurveyDto,
        userId,
        recommendUsers: [],
      },
    });
  }
}
