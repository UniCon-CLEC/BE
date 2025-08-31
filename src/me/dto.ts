import { ApiProperty } from '@nestjs/swagger';
import { CourseType, CrewStatus, EnrollmentStatus, TrackStatus } from '@prisma/client';

export class InstructorInfoDto {
  @ApiProperty({ description: '강사 ID' })
  id: string;

  @ApiProperty({ description: '강사명' })
  name: string;

  @ApiProperty({ description: '강사 이미지 URL' })
  image?: string;
}

export class MyFundingDto {
  @ApiProperty({ description: '코스 ID' })
  courseId: string;

  @ApiProperty({ description: '코스 제목' })
  title: string;

  @ApiProperty({ description: '펀딩 상태', enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @ApiProperty({ description: '내가 펀딩한 금액' })
  amountPaid: number;

  @ApiProperty({ description: '펀딩 시작일' })
  fundingStartDate: Date;

  @ApiProperty({ description: '펀딩 종료일' })
  fundingEndDate: Date;
}

export class MyCourseDto {
  @ApiProperty({ description: '코스 ID' })
  courseId: string;

  @ApiProperty({ description: '코스 타입', enum: CourseType })
  type: CourseType;

  @ApiProperty({ description: '코스 제목' })
  title: string;

  @ApiProperty({ description: '강의 대표 이미지 URL', nullable: true })
  coverImageUrl: string | null;

  @ApiProperty({ description: '강사 정보' })
  instructor: InstructorInfoDto;

  @ApiProperty({ description: '트랙 상태', enum: TrackStatus, required: false })
  trackStatus?: TrackStatus;

  @ApiProperty({ description: '크루 상태', enum: CrewStatus, required: false })
  crewStatus?: CrewStatus;

  @ApiProperty({ description: '진행 회차', required: false })
  currentRound?: number;

  @ApiProperty({ description: '펀딩률', required: false })
  fundingRate?: number;

  @ApiProperty({ description: '펀딩 금액', required: false })
  fundedAmount?: number;

  @ApiProperty({ description: '나의 펀딩 상태', enum: EnrollmentStatus, required: false })
  myFundingStatus?: EnrollmentStatus;
}

export class MeResultDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '사용자 이름', nullable: true })
  name: string | null;

  @ApiProperty({ description: '프로필 이미지 URL', nullable: true })
  profileImageUrl: string | null;

  @ApiProperty({ description: '사용자 관심 태그 목록' })
  tags: string[];

  @ApiProperty({ description: '수강중인 코스 목록', type: [MyCourseDto] })
  courses: MyCourseDto[];

  @ApiProperty({ description: '나의 펀딩 목록', type: [MyFundingDto] })
  fundings: MyFundingDto[];
}
