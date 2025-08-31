import { Prisma } from '@prisma/client';

const commonCourseSelect = {
  id: true,
  title: true,
  courseStartDate: true,
  introduction: true,
  instructor: true,
  reviews: {
    select: {
      rating: true,
    },
  },
  notices: {
    orderBy: {
      createdAt: 'desc',
    },
  },
  sessions: {
    orderBy: {
      sessionNumber: 'asc',
    },
  },
  tags: true,
} as const;

export const trackInclude = {
  course: {
    select: commonCourseSelect,
  },
  tiers: true
} satisfies Prisma.TrackInclude;

export const crewInclude = {
  course: {
    select: commonCourseSelect,
  },
  enrollments: { where: { status: 'PAID' } },
} satisfies Prisma.CrewInclude;

export const fundingInclude = {
  course: {
    select: commonCourseSelect,
  },
  enrollments: {
    where: { status: 'PAID' },
    select: { amountPaid: true },
  },
  fundingTiers: true
} satisfies Prisma.FundingInclude;

export type TrackWithDetails = Prisma.TrackGetPayload<{
  include: typeof trackInclude;
}>;

export type CrewWithDetails = Prisma.CrewGetPayload<{
  include: typeof crewInclude;
}>;

export type FundingWithDetails = Prisma.FundingGetPayload<{
  include: typeof fundingInclude;
}>;

export type CourseFromDetails =
  | TrackWithDetails['course']
  | CrewWithDetails['course']
  | FundingWithDetails['course'];