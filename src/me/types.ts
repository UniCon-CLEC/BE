import { Prisma } from '@prisma/client';
import { MyCourseDto } from './dto';

const userWithEnrollmentsQuery = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    tags: { select: { name: true } },
    fundingEnrollments: {
      select: {
        status: true,
        createdAt: true,
        amountPaid: true,
        funding: {
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
                introduction: { select: { coverImageUrl: true } },
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
    trackEnrollments: {
      select: {
        status: true,
        createdAt: true,
        track: {
          select: {
            status: true,
            course: {
              select: {
                id: true,
                type: true,
                title: true,
                courseStartDate: true,
                instructor: true,
                introduction: { select: { coverImageUrl: true } },
              }
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
                introduction: { select: { coverImageUrl: true } },
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

export type CourseForSort = MyCourseDto & { createdAt: Date };