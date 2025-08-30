import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurveyDto } from '../dto';

@Injectable()
export class RecommendResponseUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(surveyId: string, userId: string): Promise<SurveyDto> {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey)
      throw new NotFoundException(`ID가 "${surveyId}"인 Survey를 찾을 수 없습니다.`,)
    
    if (userId === survey.userId)
      throw new ConflictException('자신의 게시글은 추천할 수 없습니다.');

    if (survey.recommendUsers.includes(userId))
      throw new ConflictException('이미 추천한 게시물입니다.');

    const updatedRecommendUsers = [
      ...new Set([...survey.recommendUsers, userId]),
    ];
    return this.prisma.survey.update({
      where: { id: surveyId },
      data: { recommendUsers: updatedRecommendUsers },
    });
  }
}
