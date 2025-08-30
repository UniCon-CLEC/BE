import { ApiProperty } from '@nestjs/swagger';
import { SurveyType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSurveyDto {
  @IsEnum(SurveyType)
  @IsNotEmpty()
  type: SurveyType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}

export class SurveyDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SurveyType })
  type: SurveyType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isMine: boolean;

  @ApiProperty()
  recommendUsers: string[];
}
