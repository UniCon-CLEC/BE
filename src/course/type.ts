import { Prisma } from "@prisma/client"

const trackQueryArgs = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    course: {
      include: {
        introduction: { select: { coverImageUrl: true } },
        instructor: true,
        reviews: { select: { rating: true } }
      }
    },
    enrollments: {
      where: { status: 'PAID' },
      select: { amountPaid: true }
    }
  }
})

export type TrackWithDetails = Prisma.TrackGetPayload<typeof trackQueryArgs>

const crewQueryArgs = Prisma.validator<Prisma.CrewDefaultArgs>()({
  include: {
    course: {
      include: {
        introduction: { select: { coverImageUrl: true } },
        instructor: true,
        reviews: { select: { rating: true } }
      }
    },
    enrollments: { where: { status: 'PAID' } }
  }
})

export type CrewWithDetails = Prisma.CrewGetPayload<typeof crewQueryArgs>