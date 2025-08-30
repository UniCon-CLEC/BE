import { Injectable } from '@nestjs/common';
import { Survey, SurveyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from '../dto';

@Injectable()
export class GetAllResponsesUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(type: SurveyType, userId?: string): Promise<SurveyDto[]> {
    const responses = await this.prisma.survey.findMany({
      where: { type },
    });

    return responses.map((response) => this.toDto(response, userId));
  }

  private toDto(response: Survey, userId?: string): SurveyDto {
    return {
      ...response,
      isMine: userId ? response.userId === userId : false,
    };
  }
}
