import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyDto } from '../dto';
import { Survey } from '@prisma/client';

@Injectable()
export class CreateSurveyResponseUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    createSurveyDto: CreateSurveyDto,
    userId: string,
  ): Promise<Survey> {
    return this.prisma.survey.create({
      data: {
        ...createSurveyDto,
        userId,
        recommendUsers: [],
      },
    });
  }
}
