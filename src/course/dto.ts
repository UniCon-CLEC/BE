import { ApiProperty } from '@nestjs/swagger';
import { TrackStatus, CrewStatus } from '@prisma/client';
import { InstructorInfoDto } from 'src/me/dto';

export class CourseBaseDto {
  @ApiProperty({ description: '코스 ID' })
  courseId: string;

  @ApiProperty({ description: '강의 제목' })
  title: string;

  @ApiProperty({ description: '강사 정보' })
  instructor: InstructorInfoDto;

  @ApiProperty({ description: '강의 대표 이미지 URL', nullable: true })
  coverImageUrl: string | null;

  @ApiProperty({ description: '강의 시작일' })
  courseStartDate: Date;

  @ApiProperty({ description: '평균 평점' })
  averageRating: number;
}

export class TrackDto extends CourseBaseDto {
  @ApiProperty({ description: '트랙 상태', enum: TrackStatus })
  status: TrackStatus;

  @ApiProperty({ description: '펀딩 진행률 (%)' })
  fundingProgress: number;

  @ApiProperty({ description: '펀딩 목표액' })
  fundingTargetAmount: number;

  @ApiProperty({ description: '현재 펀딩액' })
  currentFundingAmount: number;

  @ApiProperty({ description: '펀딩 시작일' })
  fundingStartDate: Date;

  @ApiProperty({ description: '펀딩 종료일' })
  fundingEndDate: Date;
}

export class CrewDto extends CourseBaseDto {
  @ApiProperty({ description: '크루 상태', enum: CrewStatus })
  status: CrewStatus;

  @ApiProperty({ description: '가격' })
  price: number;

  @ApiProperty({ description: '수강생 수' })
  studentCount: number;
}

export class CourseSessionDto {
  @ApiProperty({ description: '세션 번호' })
  sessionNumber: number;

  @ApiProperty({ description: '세션 제목' })
  title: string;
}

export class SessionItemDto {
  sessionNumber: number
  title: String
}

export class CourseDetailSessionsDto {
  courseId: string
  title: string
  sessions: SessionItemDto[]
}