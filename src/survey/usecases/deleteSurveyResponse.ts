import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeleteSurveyResponseUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(surveyId: string, userId: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey)
      throw new NotFoundException(
        `ID가 "${surveyId}"인 Survey를 찾을 수 없습니다.`,
      );

    if (survey.userId !== userId)
      throw new ForbiddenException('게시물을 삭제할 권한이 없습니다.');

    await this.prisma.survey.delete({ where: { id: surveyId } });
  }
}
