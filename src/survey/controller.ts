import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Survey as SurveyModel, SurveyType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/types/user-request.type';
import { User } from 'src/decorators/user.decorator';
import { CreateSurveyDto } from './dto';
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
  @ApiResponse({ status: 201, description: '성공', type: Object })
  create(
    @Body(new ValidationPipe()) createSurveyDto: CreateSurveyDto,
    @User() user: AuthenticatedUser,
  ): Promise<SurveyModel> {
    return this.createSurveyResponseUsecase.execute(createSurveyDto, user.id);
  }

  @Get('track-topic')
  @ApiOperation({ summary: '트랙 주제 설문 응답 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [Object] })
  findAllTrackTopics(): Promise<SurveyModel[]> {
    return this.getAllResponsesUsecase.execute(SurveyType.TRACK_TOPIC);
  }

  @Get('crew-topic')
  @ApiOperation({ summary: '크루 주제 설문 응답 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [Object] })
  findAllCrewTopics(): Promise<SurveyModel[]> {
    return this.getAllResponsesUsecase.execute(SurveyType.CREW_TOPIC);
  }

  @Patch(':id/recommend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '설문 응답 추천' })
  @ApiResponse({ status: 200, description: '성공', type: Object })
  async recommendResponse(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<SurveyModel> {
    return this.recommendResponseUsecase.execute(id, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '설문 응답 삭제' })
  @ApiResponse({ status: 200, description: '성공', type: Object })
  delete(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
  ): Promise<void> {
    return this.deleteSurveyResponseUsecase.execute(id, user.id);
  }
}
