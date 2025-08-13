import { ApiProperty } from '@nestjs/swagger';
import { CourseStatus, EnrollmentStatus } from '@prisma/client';

export class UpdateMeDto {
  
}

export class InstructorInfoDto {
    @ApiProperty({ description: '강사 ID' })
    id: string

    @ApiProperty({ description: '강사명' })
    name: string

    @ApiProperty({ description: '강사 이미지 URL' })
    image?: string

    @ApiProperty({ description: '강사 스케쥴 (표 형태의 Table로 제공?)' })
    schedule?: string

    @ApiProperty({ description: '강사 간단 소개' })
    information?: string
}

export class EnrolledCourseDto {
    @ApiProperty({ description: '강의 ID' })
    courseId: string;

    @ApiProperty({ description: '강의 제목' })
    title: string;

    @ApiProperty({ description: '강의 상태 (펀딩중, 진행중 등)', enum: CourseStatus })
    courseStatus: CourseStatus;

    @ApiProperty({ description: '강의 대표 이미지 URL', nullable: true })
    coverImageUrl: string | null;

    @ApiProperty({ description: '강사 정보', nullable: true })
    instructor: InstructorInfoDto;

    @ApiProperty({ description: '나의 수강 상태 (결제완료, 펀딩참여 등)', enum: EnrollmentStatus })
    enrollmentStatus: EnrollmentStatus;

    @ApiProperty({ description: '펀딩 진행률 / 금액 (%)' })
    fundingProgress: number;

    @ApiProperty({ description: '펀딩 시작일' })
    fundingStartDate: Date;

    @ApiProperty({ description: '펀딩 종료일' })
    fundingEndDate: Date;

    @ApiProperty({ description: '강의 시작일' })
    courseStartDate: Date;
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

    @ApiProperty({ description: '사용자가 등록한 강의 목록', type: [EnrolledCourseDto] })
    enrolledCourses: EnrolledCourseDto[];
}