import { Module } from '@nestjs/common';
import { SurveyController } from './controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateSurveyResponseUsecase } from './usecases/createSurveyResponse';
import { DeleteSurveyResponseUsecase } from './usecases/deleteSurveyResponse';
import { GetAllResponsesUsecase } from './usecases/getAllResponses';
import { RecommendResponseUsecase } from './usecases/recommendResponse';

@Module({
  imports: [PrismaModule],
  controllers: [SurveyController],
  providers: [
    CreateSurveyResponseUsecase,
    DeleteSurveyResponseUsecase,
    GetAllResponsesUsecase,
    RecommendResponseUsecase,
  ],
})
export class SurveyModule {}
