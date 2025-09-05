import { ApiProperty } from '@nestjs/swagger';
import {
  FundingStatus,
  CourseLifecycleStatus,
} from '@prisma/client';
import { InstructorInfoDto } from 'src/me/dto';

export class TagDto {
  @ApiProperty({ description: '태그 ID' })
  id: number;

  @ApiProperty({ description: '태그 이름' })
  name: string;
}

export class TrackTierDto {
  @ApiProperty({ description: '트랙 등급(티어) ID' })
  id: number;

  @ApiProperty({ description: '가격' })
  price: number;

  @ApiProperty({ description: '티어 제목', example: '얼리버드' })
  title: string;

  @ApiProperty({ description: '혜택 설명' })
  benefitDescription: string;
}

export class FundingTierDto {
  @ApiProperty({ description: '펀딩 등급(티어) ID' })
  id: number;

  @ApiProperty({ description: '펀딩 가격' })
  price: number;

  @ApiProperty({ description: '티어 제목', example: '슈퍼 얼리버드' })
  title: string;

  @ApiProperty({ description: '혜택 설명' })
  benefitDescription: string;
}

export class CourseNoticeDto {
  @ApiProperty({ description: '공지사항 ID' })
  id: number;

  @ApiProperty({ description: '공지사항 제목' })
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  content: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;
}

export class CourseSessionDto {
  @ApiProperty({ description: '세션 번호' })
  sessionNumber: number;

  @ApiProperty({ description: '세션 제목' })
  title: string;
}

export class CourseBaseDto {
  @ApiProperty({ description: '코스 ID' })
  courseId: string;

  @ApiProperty({ description: '강의 제목' })
  title: string;

  @ApiProperty({ description: '강사 정보' })
  instructor: InstructorInfoDto;

  @ApiProperty({ description: '강의 시작일' })
  courseStartDate: Date;

  @ApiProperty({ description: '평균 평점' })
  averageRating: number;

  @ApiProperty({ type: () => [CourseNoticeDto], description: '공지사항' })
  notices: CourseNoticeDto[];

  @ApiProperty({ type: () => [CourseSessionDto], description: '세션' })
  sessions: CourseSessionDto[];

  @ApiProperty({ description: '커버 이미지 URL' })
  coverImageUrl: string;
  
  @ApiProperty({ description: '한줄 설명' })
  description: string;

  @ApiProperty({ description: '스케쥴 상세' })
  scheduleDetails: string;

  @ApiProperty({ type: [String], description: '태그 이름들 배열' })
  tags: string[];
}

export class TrackCourseDto extends CourseBaseDto {
  @ApiProperty({ description: '트랙 상태', enum: CourseLifecycleStatus })
  status: CourseLifecycleStatus;

  @ApiProperty({ type: () => [TrackTierDto], description: '트랙 등급(티어) 목록' })
  tiers: TrackTierDto[];
}

export class FundingCourseDto extends CourseBaseDto {
  @ApiProperty({ description: '펀딩 상태', enum: FundingStatus })
  status: FundingStatus;

  @ApiProperty({ description: '펀딩 목표액' })
  fundingTargetAmount: number;

  @ApiProperty({ description: '현재까지 모금된 금액' })
  totalFundedAmount: number;

  @ApiProperty({ description: '펀딩 달성률 (%)' })
  achievementRate: number;

  @ApiProperty({ description: '펀딩 시작일' })
  fundingStartDate: Date;

  @ApiProperty({ description: '펀딩 종료일' })
  fundingEndDate: Date;

  @ApiProperty({ description: '펀딩 후 가격', nullable: true })
  postFundingPrice: number | null;

  @ApiProperty({ description: '펀딩한 사람 수' })
  enrollmentCount: number

  @ApiProperty({ type: () => [FundingTierDto], description: '펀딩 등급(티어) 목록' })
  fundingTiers: FundingTierDto[];
}

export class CrewCourseDto extends CourseBaseDto {
  @ApiProperty({ description: '크루 상태', enum: CourseLifecycleStatus })
  status: CourseLifecycleStatus;

  @ApiProperty({ description: '가격' })
  price: number;

  @ApiProperty({ description: '현재 수강생 수' })
  studentCount: number;
}

class CourseIntroBlockDto {
  @ApiProperty({ description: '블록 순서', example: 1 })
  order: number;

  @ApiProperty({ description: '블록 타입 (TEXT, IMAGE 등)', example: 'IMAGE' })
  type: string;

  @ApiProperty({
    description: '텍스트 블록의 내용 (타입이 TEXT일 경우)',
    required: false,
    nullable: true,
    example: '이 코스는...',
  })
  content?: string | null;

  @ApiProperty({
    description: '이미지 블록의 URL (타입이 IMAGE일 경우)',
    required: false,
    nullable: true,
    example: 'https://example.com/image.png',
  })
  url?: string | null;
}

export class CourseIntroductionDto {
  @ApiProperty({
    description: '코스 소개를 구성하는 블록 배열',
    type: () => [CourseIntroBlockDto],
  })
  blocks: CourseIntroBlockDto[];
}

class CurriculumSessionDto {
  @ApiProperty({ description: '세션 번호', example: 1 })
  sessionNumber: number;

  @ApiProperty({ description: '세션 제목', example: '1주차: 코스의 시작' })
  title: string;

  @ApiProperty({
    description: '세션 부제목',
    required: false,
    nullable: true,
    example: '기본 개념과 환경 설정',
  })
  subtitle?: string | null;
}

export class CourseCurriculumDto {
  @ApiProperty({
    description: '코스의 세션(커리큘럼) 목록',
    type: () => [CurriculumSessionDto],
  })
  sessions: CurriculumSessionDto[];
}

export class CourseMaterialDto {
  @ApiProperty({
    description: '코스 수강에 필요한 준비물 목록',
    type: [String],
    example: ['개인 노트북', '필기구'],
  })
  supplies: string[];
}

export class CourseInstructorDto {
  @ApiProperty({ description: '강사 이름', example: '김개발' })
  name: string;

  @ApiProperty({
    description: '강사 프로필 이미지 URL',
    required: false,
    nullable: true,
    example: 'https://example.com/instructor.png',
  })
  image: string | null;

  @ApiProperty({
    description: '강사 상세 소개',
    required: false,
    nullable: true,
    example: '10년차 베테랑 개발자입니다.',
  })
  information: string | null;

  @ApiProperty({
    description: '강사 연락 가능 시간 등 스케줄 정보',
    required: false,
    nullable: true,
    example: '월-금, 오전 10시부터 오후 6시까지',
  })
  schedule: string | null;
}