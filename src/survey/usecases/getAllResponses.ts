import { Injectable } from '@nestjs/common';
import { Survey, SurveyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GetAllResponsesUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(type: SurveyType): Promise<Survey[]> {
    return await this.prisma.survey.findMany({
      where: { type },
      include: { user: true },
    });
  }
}
