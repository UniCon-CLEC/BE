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

  @ApiProperty({ description: '혜택 설명' })
  benefitDescription: string;
}

export class FundingTierDto {
  @ApiProperty({ description: '펀딩 등급(티어) ID' })
  id: number;

  @ApiProperty({ description: '펀딩 가격' })
  price: number;

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

/* export class CourseIntroductionDto {
  @ApiProperty({ description: '소개 ID' })
  id: number;

  @ApiProperty({ description: '커버 이미지 URL' })
  coverImageUrl: string;

  @ApiProperty({ description: '설명' })
  description: string;

  @ApiProperty({ description: '일정 상세' })
  scheduleDetails: string;
} */

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

  @ApiProperty({ description: 'coverImageUrl' })
  coverImageUrl: string;
  
  @ApiProperty({ description: '한줄 설명' })
  description: string;

  @ApiProperty({ description: '스케쥴 상세' })
  scheduleDetails: string;

  /* @ApiProperty({
    type: () => CourseIntroductionDto,
    description: '강의 소개',
    nullable: true,
  })
  introduction: CourseIntroductionDto | null; */

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