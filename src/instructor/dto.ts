import { ApiProperty } from '@nestjs/swagger';
import { CourseType, TrackStatus, CrewStatus } from '@prisma/client';

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

export class CreateTrackDto {
  @ApiProperty({ description: '코스 제목' })
  title: string;

  @ApiProperty({ description: '코스 시작일' })
  courseStartDate: Date;

  @ApiProperty({ description: '트랙 상태', enum: TrackStatus, required: false })
  status?: TrackStatus;

  @ApiProperty({ description: '펀딩 목표액', required: false })
  fundingTargetAmount?: number;

  @ApiProperty({ description: '펀딩 시작일', required: false })
  fundingStartDate?: Date;

  @ApiProperty({ description: '펀딩 종료일', required: false })
  fundingEndDate?: Date;
}

export class CreateCrewDto {
  @ApiProperty({ description: '코스 제목' })
  title: string;

  @ApiProperty({ description: '코스 시작일' })
  courseStartDate: Date;

  @ApiProperty({ description: '크루 상태', enum: CrewStatus, required: false })
  status?: CrewStatus;

  @ApiProperty({ description: '가격', required: false })
  price?: number;
}
