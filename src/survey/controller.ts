import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SurveyType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/types/user-request.type';
import { User } from 'src/decorators/user.decorator';
import { CreateSurveyDto, SurveyDto } from './dto';
import { CreateSurveyResponseUsecase } from './usecases/createSurveyResponse';
import { DeleteSurveyResponseUsecase } from './usecases/deleteSurveyResponse';
import { GetAllResponsesUsecase } from './usecases/getAllResponses';
import { RecommendResponseUsecase } from './usecases/recommendResponse';

@ApiTags('Survey (설문)')
@Controller('surveys')
export class SurveyController {
  constructor(
    private readonly createSurveyResponseUsecase: CreateSurveyResponseUsecase,
    private readonly deleteSurveyResponseUsecase: DeleteSurveyResponseUsecase,
    private readonly getAllResponsesUsecase: GetAllResponsesUsecase,
    private readonly recommendResponseUsecase: RecommendResponseUsecase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '설문 응답 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  create(
    @Body(new ValidationPipe()) createSurveyDto: CreateSurveyDto,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    return this.createSurveyResponseUsecase.execute(createSurveyDto, user.id);
  }

  @Get('track-topic')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '트랙 주제 설문 응답 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [SurveyDto] })
  findAllTrackTopics(
    @User() user: AuthenticatedUser | null,
  ): Promise<SurveyDto[]> {
    return this.getAllResponsesUsecase.execute(SurveyType.TRACK_TOPIC, user?.id);
  }

  @Get('crew-topic')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '크루 주제 설문 응답 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [SurveyDto] })
  findAllCrewTopics(
    @User() user: AuthenticatedUser | null,
  ): Promise<SurveyDto[]> {
    return this.getAllResponsesUsecase.execute(SurveyType.CREW_TOPIC, user?.id);
  }

  @Get('funding-topic')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '펀딩 주제 설문 응답 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [SurveyDto] })
  findAllFundingTopics(
    @User() user: AuthenticatedUser | null,
  ): Promise<SurveyDto[]> {
    return this.getAllResponsesUsecase.execute(SurveyType.FUNDING_TOPIC, user?.id);
  }

  @Patch(':id/recommend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '설문 응답 추천' })
  @ApiResponse({ status: 200, description: '성공' })
  async recommendResponse(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.recommendResponseUsecase.execute(id, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '설문 응답 삭제' })
  @ApiResponse({ status: 200, description: '성공' })
  delete(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    return this.deleteSurveyResponseUsecase.execute(id, user.id);
  }
}
