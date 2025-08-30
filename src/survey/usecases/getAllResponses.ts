import { Injectable } from '@nestjs/common';
import { Survey, SurveyType, Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from '../dto';

@Injectable()
export class GetAllResponsesUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(type: SurveyType, userId?: string): Promise<SurveyDto[]> {
    const responses = await this.prisma.survey.findMany({
      where: { type },
      include: {
        tags: {
          include: {
            parent: true,
          },
        },
      },
    });

    return responses.map((response) => this.toDto(response, userId));
  }

  private toDto(response: Survey & { tags: (Tag & { parent: Tag | null })[] }, userId?: string): SurveyDto {
    return {
      ...response,
      isMine: userId ? response.userId === userId : false,
      tags: response.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        parentId: tag.parentId,
        parentName: tag.parent ? tag.parent.name : null,
        children: [],
      })),
    };
  }
}
