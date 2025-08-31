import { ApiProperty } from '@nestjs/swagger';
import { CourseType, TrackStatus, CrewStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';

export class CourseInfoDto {
  @ApiProperty({ description: '코스 ID' })
  id: string;

  @ApiProperty({ description: '코스 제목' })
  title: string;

  @ApiProperty({ description: '코스 타입', enum: CourseType })
  type: CourseType;

  @ApiProperty({ description: '코스 시작일' })
  courseStartDate: Date;
}

export class InstructorDto {
  @ApiProperty({ description: '강사 ID' })
  id: string;

  @ApiProperty({ description: '강사 이름' })
  name: string;

  @ApiProperty({ description: '강사 프로필 이미지 URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: '강사 정보', nullable: true })
  information: string | null;

  @ApiProperty({ description: '강사 스케줄', nullable: true })
  schedule: string | null;

  @ApiProperty({ description: '강사의 코스 목록', type: [CourseInfoDto] })
  courses: CourseInfoDto[];
}

export class CreateCourseIntroductionDto {
  @ApiProperty({ description: '커버 이미지 URL' })
  @IsString()
  coverImageUrl: string;

  @ApiProperty({ description: '코스 설명' })
  @IsString()
  description: string;

  @ApiProperty({ description: '스케줄 상세' })
  @IsString()
  scheduleDetails: string;
}

export class CreateCourseSessionDto {
  @ApiProperty({ description: '세션 번호' })
  @IsNumber()
  sessionNumber: number;

  @ApiProperty({ description: '세션 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '세션 내용', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '자료', required: false })
  @IsString()
  @IsOptional()
  materials?: string;
}

export class CreateTrackDto {
  @ApiProperty({ description: '코스 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '코스 시작일' })
  @IsDate()
  courseStartDate: Date;

  @ApiProperty({ description: '트랙 상태', enum: TrackStatus, required: false })
  @IsEnum(TrackStatus)
  @IsOptional()
  status?: TrackStatus;

  @ApiProperty({ description: '펀딩 목표액' })
  @IsNumber()
  fundingTargetAmount: number;

  @ApiProperty({ description: '펀딩 시작일' })
  @IsDate()
  fundingStartDate: Date;

  @ApiProperty({ description: '펀딩 종료일' })
  @IsDate()
  fundingEndDate: Date;

  @ApiProperty({ type: CreateCourseIntroductionDto })
  @ValidateNested()
  @Type(() => CreateCourseIntroductionDto)
  @IsObject()
  introduction: CreateCourseIntroductionDto;

  @ApiProperty({ type: [CreateCourseSessionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseSessionDto)
  sessions: CreateCourseSessionDto[];
}

export class CreateCrewDto {
  @ApiProperty({ description: '코스 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '코스 시작일' })
  @IsDate()
  courseStartDate: Date;

  @ApiProperty({ description: '크루 상태', enum: CrewStatus, required: false })
  @IsEnum(CrewStatus)
  @IsOptional()
  status?: CrewStatus;

  @ApiProperty({ description: '가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ type: CreateCourseIntroductionDto })
  @ValidateNested()
  @Type(() => CreateCourseIntroductionDto)
  @IsObject()
  introduction: CreateCourseIntroductionDto;

  @ApiProperty({ type: [CreateCourseSessionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseSessionDto)
  sessions: CreateCourseSessionDto[];
}
