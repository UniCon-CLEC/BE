import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeResultDto, MyCourseDto, MyFundingDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CourseForSort, CrewEnrollmentForDto, TrackEnrollmentForDto, UserWithEnrollments } from './types';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeResultDto> {
    const user = await this.fetchUserWithEnrollments(userId)

    const trackCourses = user.trackEnrollments.map((e) =>
      this.transformTrackToCourseDto(e)
    )
    const crewCourses = user.crewEnrollments.map((e) =>
      this.transformCrewToCourseDto(e)
    )
    const fundings = user.trackEnrollments.map((e) =>
      this.transformTrackToFundingDto(e)
    )

    const courses: MyCourseDto[] = [...trackCourses, ...crewCourses]

    return {
      id: user.id,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      tags: user.tags.map((tag) => tag.name),
      courses,
      fundings
    }
  }

  private fetchUserWithEnrollments(userId: string): Promise<UserWithEnrollments>{
    const courseSelection = {
      id: true, 
      type: true, title: true, courseStartDate: true,
      instructor: true,
      introduction: { select: { coverImageUrl: true } }
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tags: { select: { name: true } },
        trackEnrollments: {
          select: {
            status: true, createdAt: true, amountPaid: true,
            track: {
              select: {
                status: true, fundingTargetAmount: true, fundingStartDate: true, fundingEndDate: true, courseId: true,
                course: { select: courseSelection },
                enrollments: { where: { status: 'PAID' }, select: { amountPaid: true } }
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
                course: { select: courseSelection }
              }
            }
          }
        }
      }
    })
  }

  private transformTrackToCourseDto(enrollment: TrackEnrollmentForDto): CourseForSort {
    const { track, status: myFundingStatus, createdAt } = enrollment
    const { course } = track

    const currentFundingAmount = track.enrollments.reduce(
      (sum, en) => sum.add(en.amountPaid), new Decimal(0),
    )

    const targetAmount = track.fundingTargetAmount
    let fundingProgress = 0
    if (targetAmount.greaterThan(0)) {
      fundingProgress = Math.round(
        currentFundingAmount.div(targetAmount).toNumber() * 100,
      )
    }
    
    return {
      courseId: course.id,
      type: course.type,
      title: course.title,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      instructor: course.instructor,
      trackStatus: track.status,
      fundingRate: fundingProgress,
      fundedAmount: currentFundingAmount.toNumber(),
      myFundingStatus,
      createdAt
    };
  }

  private transformCrewToCourseDto(enrollment: CrewEnrollmentForDto): CourseForSort {
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
      myFundingStatus: myEnrollmentStatus,
      createdAt
    }
  }

  private transformTrackToFundingDto(enrollment: TrackEnrollmentForDto): MyFundingDto {
    const { track, status, amountPaid } = enrollment
    return {
      courseId: track.courseId,
      title: track.course.title,
      status,
      amountPaid: amountPaid.toNumber(),
      fundingStartDate: track.fundingStartDate,
      fundingEndDate: track.fundingEndDate
    }
  }
}
