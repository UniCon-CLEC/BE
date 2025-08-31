import { Prisma } from '@prisma/client';
import { MyCourseDto } from './dto';

const userWithEnrollmentsQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    tags: { select: { name: true } },
    trackEnrollments: {
      select: {
        status: true,
        createdAt: true,
        amountPaid: true,
        track: {
          select: {
            status: true,
            fundingTargetAmount: true,
            fundingStartDate: true,
            fundingEndDate: true,
            courseId: true,
            course: {
              select: {
                id: true,
                type: true,
                title: true,
                courseStartDate: true,
                instructor: true,
                introduction: { select: { coverImageUrl: true } }
              }
            },
            enrollments: {
              where: { status: 'PAID' },
              select: { amountPaid: true }
            }
          }
        }
      }
    },
    crewEnrollments: {
      select: {
        status: true,
        createdAt: true,
        crew: {
          select: {
            status: true,
            course: {
              select: {
                id: true,
                type: true,
                title: true,
                courseStartDate: true,
                instructor: true,
                introduction: { select: { coverImageUrl: true } }
              }
            }
          }
        }
      }
    }
  }
})

export type UserWithEnrollments = Prisma.UserGetPayload<
    typeof userWithEnrollmentsQuery
>

export type TrackEnrollmentForDto = UserWithEnrollments['trackEnrollments'][0];
export type CrewEnrollmentForDto = UserWithEnrollments['crewEnrollments'][0];

export type CourseForSort = MyCourseDto & { createdAt: Date };