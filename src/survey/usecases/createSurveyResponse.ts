import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyDto } from '../dto';

@Injectable()
export class CreateSurveyResponseUsecase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    createSurveyDto: CreateSurveyDto,
    userId: string,
  ): Promise<void> {
    const { tagId, ...rest } = createSurveyDto;

    const tagExists = await this.prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tagExists) {
      throw new BadRequestException(`Tag with ID ${tagId} not found.`);
    }

    await this.prisma.survey.create({
      data: {
        ...rest,
        userId,
        recommendUsers: [],
        tags: {
          connect: { id: tagId },
        },
      },
    });
  }
}
