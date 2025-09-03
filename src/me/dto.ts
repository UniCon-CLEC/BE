import { ApiProperty } from '@nestjs/swagger';
import { CourseLifecycleStatus, CourseType, EnrollmentStatus } from '@prisma/client';
import { UserWithEnrollments } from './types';

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

  @ApiProperty({ description: '강사 정보' })
  instructor: InstructorInfoDto;

  @ApiProperty({ description: '펀딩 상태', enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @ApiProperty({ description: '내가 펀딩한 금액' })
  amountPaid: number;

  @ApiProperty({ description: '펀딩 시작일' })
  fundingStartDate: Date;

  @ApiProperty({ description: '펀딩 종료일' })
  fundingEndDate: Date;

  @ApiProperty({ description: '펀딩 목표금액' })
  fundingTargetAmount: number;

  @ApiProperty({ description: '펀딩 달성률' })
  achievementRate: number;

  @ApiProperty({ description: 'Enrollment 등록일' })
  createdAt: Date;
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

  @ApiProperty({ description: '트랙 상태', enum: CourseLifecycleStatus, required: false })
  trackStatus?: CourseLifecycleStatus;

  @ApiProperty({ description: '크루 상태', enum: CourseLifecycleStatus, required: false })
  crewStatus?: CourseLifecycleStatus;

  @ApiProperty({ description: '진행 회차', required: false })
  currentRound?: number;

  @ApiProperty({ description: '펀딩률', required: false })
  fundingRate?: number;

  @ApiProperty({ description: '펀딩 금액', required: false })
  fundedAmount?: number;

  @ApiProperty({ description: '나의 수강 상태', enum: EnrollmentStatus, required: false })
  myEnrollmentStatus?: EnrollmentStatus;

  @ApiProperty({ description: '내가 펀딩한 금액', required: false })
  amountPaid?: number;

  @ApiProperty({ description: '펀딩 시작일', required: false })
  fundingStartDate?: Date;

  @ApiProperty({ description: '펀딩 종료일', required: false })
  fundingEndDate?: Date;

  @ApiProperty({ description: '등록일' })
  createdAt: Date;
}

export class MyTrackDto {
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

  @ApiProperty({ description: '트랙 상태', enum: CourseLifecycleStatus, required: false })
  trackStatus?: CourseLifecycleStatus;

  @ApiProperty({ description: '나의 트랙 상태', enum: EnrollmentStatus, required: false })
  myTrackStatus?: EnrollmentStatus;
}

export class MyCrewDto {
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

  @ApiProperty({ description: '크루 상태', enum: CourseLifecycleStatus, required: false })
  crewStatus?: CourseLifecycleStatus;

  @ApiProperty({ description: '진행 회차', required: false })
  currentRound?: number;

  @ApiProperty({ description: '나의 크루 상태', enum: EnrollmentStatus, required: false })
  myCrewStatus?: EnrollmentStatus;
}

export class MeResultDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '이메일 (없으면 기본으로)' })
  email: string;

  @ApiProperty({ description: '사용자 이름', nullable: true })
  name: string | null;

  @ApiProperty({ description: '프로필 이미지 URL', nullable: true })
  profileImageUrl: string | null;

  @ApiProperty({ description: '사용자 관심 태그 목록' })
  tags: string[];

  @ApiProperty({ description: '최신순 코스 목록', type: [MyCourseDto] })
  newestCourses: MyCourseDto[];

  @ApiProperty({ description: '오래된순 코스 목록', type: [MyCourseDto] })
  oldestCourses: MyCourseDto[];
}

export class MeDto {
  @ApiProperty({ description: '사용자 ID' })
  id: string;

  @ApiProperty({ description: '이메일 (없으면 기본으로)' })
  email: string;

  @ApiProperty({ description: '사용자 이름', nullable: true })
  name: string | null;

  @ApiProperty({ description: '프로필 이미지 URL', nullable: true })
  profileImageUrl: string | null;

  @ApiProperty({ description: '사용자 관심 태그 목록' })
  tags: string[];
}

export type FundingEnrollmentForDto = UserWithEnrollments['fundingEnrollments'][0];
export type TrackEnrollmentForDto = UserWithEnrollments['trackEnrollments'][0];
export type CrewEnrollmentForDto = UserWithEnrollments['crewEnrollments'][0];