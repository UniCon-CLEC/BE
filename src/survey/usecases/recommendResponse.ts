import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendResponseUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(surveyId: string, userId: string): Promise<void> {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey)
      throw new NotFoundException(`ID:${surveyId}를 찾을 수 없습니다`)
    
    if (userId === survey.userId)
      throw new ConflictException('자신의 게시글은 추천할 수 없습니다.');

    if (survey.recommendUsers.includes(userId))
      throw new ConflictException('이미 추천한 게시물입니다.');

    const updatedRecommendUsers = [
      ...new Set([...survey.recommendUsers, userId]),
    ];

    await this.prisma.survey.update({
      where: { id: surveyId },
      data: { recommendUsers: updatedRecommendUsers },
    });
  }
}
