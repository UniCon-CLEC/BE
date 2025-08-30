import { Injectable } from '@nestjs/common';
import { SurveyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from '../dto';

@Injectable()
export class GetAllResponsesUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(type: SurveyType): Promise<SurveyDto[]> {
    return await this.prisma.survey.findMany({
      where: { type },
    });
  }
}
