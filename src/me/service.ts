import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrewEnrollmentForDto, FundingEnrollmentForDto, MeDto, MeResultDto, MyCourseDto, MyCrewDto, MyFundingDto, MyTrackDto, TrackEnrollmentForDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
import { 
  UserWithEnrollments 
} from './types';
import { CourseLifecycleStatus } from '@prisma/client';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeResultDto> {
    const user = await this.fetchUserWithEnrollments(userId)

    const fundingCourses = user.fundingEnrollments.map((e) => 
      this.transformFundingToCourseDto(e)
    )
    const trackCourses = user.trackEnrollments.map((e) =>
      this.transformTrackToMyCourseDto(e)
    )
    const crewCourses = user.crewEnrollments.map((e) =>
      this.transformCrewToMyCourseDto(e)
    )

    const courses: MyCourseDto[] = [...fundingCourses, ...trackCourses, ...crewCourses]

    //추후 페이지네이션 추가 예정
    const newestCourses = [...courses]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8);

    const oldestCourses = [...courses]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, 8);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl ?? `${process.env.CLOUDFRONT_URL}/default.svg`,
      tags: user.tags.map((tag) => tag.name),
      newestCourses,
      oldestCourses,
    }
  }

  async getMeInfo(userId: string): Promise<MeDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tags: { select: { name: true } },
      }
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl ?? `${process.env.CLOUDFRONT_URL}/default.svg`,
      tags: user.tags.map((tag) => tag.name),
    }
  }

  async getMeTrack(userId: string): Promise<MyTrackDto[]> {
    const user = await this.fetchUserWithEnrollments(userId)
    return user.trackEnrollments.map((e) => this.transformTrackToCourseDto(e))
  }

  async getMeCrew(userId: string): Promise<MyCrewDto[]> {
    const user = await this.fetchUserWithEnrollments(userId)
    return user.crewEnrollments.map((e) => this.transformCrewToCourseDto(e))
  }

  async getMeFunding(userId: string): Promise<MyFundingDto[]> {
    const user = await this.fetchUserWithEnrollments(userId)
    return user.fundingEnrollments.map((e) => this.transformFundingToFundingDto(e))
  }

  private fetchUserWithEnrollments(userId: string): Promise<UserWithEnrollments>{
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tags: { select: { name: true } },
        fundingEnrollments: {
          select: {
            status: true, createdAt: true, amountPaid: true,
            funding: {
              select: {
                status: true, fundingTargetAmount: true, fundingStartDate: true, fundingEndDate: true, courseId: true,
                course: { 
                  select: {
                    id: true, type: true, title: true, courseStartDate: true, instructor: true,
                    introduction: { select: { coverImageUrl: true } }
                  }
                 },
                enrollments: { where: { status: 'PAID' }, select: { amountPaid: true } }
              }
            }
          }
        },
        trackEnrollments: {
          select: {
            status: true, createdAt: true,
            track: {
              select: {
                status: true,
                course: { 
                  select: {
                    id: true, type: true, title: true, courseStartDate: true, instructor: true,
                    introduction: { select: { coverImageUrl: true } }
                  }
                 },
              }
            }
          }
        },
        crewEnrollments: {
          select: {
            status: true, createdAt: true,
            crew: {
              select: {
                status: true,
                course: { 
                  select: {
                    id: true, type: true, title: true, courseStartDate: true, instructor: true,
                    introduction: { select: { coverImageUrl: true } }
                  }
                 },
              }
            }
          }
        }
      }
    })
  }

  private transformFundingToCourseDto(enrollment: FundingEnrollmentForDto): MyCourseDto {
    const { funding, status: myEnrollmentStatus, amountPaid, createdAt } = enrollment
    const { course } = funding

    const currentFundingAmount = funding.enrollments.reduce(
      (sum, en) => sum.add(en.amountPaid), new Decimal(0),
    )

    const targetAmount = funding.fundingTargetAmount
    let fundingProgress = 0
    if (targetAmount.greaterThan(0)) {
      fundingProgress = Math.round(
        currentFundingAmount.div(targetAmount).toNumber() * 100,
      )
    }

    const trackStatus: CourseLifecycleStatus = (() => {
      switch (funding.status) {
        case 'FUNDING':
          return 'ACTIVE';
        case 'PREPARING':
          return 'PREPARING';
        case 'ACTIVE':
          return 'ACTIVE';
        case 'COMPLETED':
          return 'COMPLETED';
        case 'CANCELED':
          return 'CANCELED';
      }
    })();
    
    return {
      courseId: course.id,
      type: course.type,
      title: course.title,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      instructor: course.instructor,
      trackStatus,
      fundingRate: fundingProgress,
      fundedAmount: currentFundingAmount.toNumber(),
      myEnrollmentStatus,
      amountPaid: amountPaid.toNumber(),
      fundingStartDate: funding.fundingStartDate,
      fundingEndDate: funding.fundingEndDate,
      createdAt,
    };
  }

  private transformTrackToMyCourseDto(enrollment: TrackEnrollmentForDto): MyCourseDto {
    const { track, status: myEnrollmentStatus, createdAt } = enrollment
    const { course } = track
    
    return {
      courseId: course.id,
      type: course.type,
      title: course.title,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      instructor: course.instructor,
      trackStatus: track.status,
      myEnrollmentStatus: myEnrollmentStatus,
      createdAt,
    };
  }

  private transformCrewToMyCourseDto(enrollment: CrewEnrollmentForDto): MyCourseDto {
    const { crew, status: myEnrollmentStatus, createdAt } = enrollment
    const { course } = crew

    const now = new Date()
    const courseStartDate = new Date(course.courseStartDate)
    const weeksPassed = Math.floor(
      (now.getTime() - courseStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    )
    const ongoingSession = weeksPassed > 0 ? weeksPassed : 0
    
    return {
      courseId: course.id,
      type: course.type,
      title: course.title,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      instructor: course.instructor,
      crewStatus: crew.status,
      currentRound: ongoingSession,
      myEnrollmentStatus: myEnrollmentStatus,
      createdAt,
    }
  }

  private transformTrackToCourseDto(enrollment: TrackEnrollmentForDto): MyTrackDto {
    const { track, status: myTrackStatus } = enrollment
    const { course } = track
    
    return {
      courseId: course.id,
      type: course.type,
      title: course.title,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      instructor: course.instructor,
      trackStatus: track.status,
      myTrackStatus,
    };
  }

  private transformCrewToCourseDto(enrollment: CrewEnrollmentForDto): MyCrewDto {
    const { crew, status: myCrewStatus } = enrollment
    const { course } = crew

    const now = new Date()
    const courseStartDate = new Date(course.courseStartDate)
    const weeksPassed = Math.floor(
      (now.getTime() - courseStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    )
    const ongoingSession = weeksPassed > 0 ? weeksPassed : 0
    
    return {
      courseId: course.id,
      type: course.type,
      title: course.title,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      instructor: course.instructor,
      crewStatus: crew.status,
      currentRound: ongoingSession,
      myCrewStatus,
    }
  }

  private transformFundingToFundingDto(enrollment: FundingEnrollmentForDto): MyFundingDto {
    const { funding, status, amountPaid } = enrollment

    const total = funding.enrollments.reduce(
      (s, e) => s + e.amountPaid.toNumber(), 0
    )

    const targetAmount = funding.fundingTargetAmount.toNumber()
    const achievementRate = 
      targetAmount > 0
        ? parseFloat(((total / targetAmount) * 100).toFixed(1))
        : 0
    return {
      courseId: funding.courseId,
      title: funding.course.title,
      status,
      amountPaid: amountPaid.toNumber(),
      fundingStartDate: funding.fundingStartDate,
      fundingEndDate: funding.fundingEndDate,
      fundingTargetAmount: funding.fundingTargetAmount.toNumber(),
      achievementRate
    }
  }
}