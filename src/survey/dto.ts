import { ApiProperty } from '@nestjs/swagger';
import { SurveyType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength, IsOptional, IsArray, IsInt, Min } from 'class-validator';
import { TagResponseDto } from 'src/tag/dto';

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

  @ApiProperty({ description: '태그 ID', type: Number })
  @IsInt()
  @Min(1)
  tagId: number;
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

  @ApiProperty({ type: [TagResponseDto], description: '설문에 연결된 태그 목록' })
  tags: TagResponseDto[];
}
