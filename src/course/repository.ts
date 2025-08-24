import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EnrollmentStatus } from '@prisma/client'

@Injectable()
export class CourseRepository {
  private readonly trackInclude = {
    course: {
      include: {
        introduction: { select: { coverImageUrl: true } },
        instructor: true,
        reviews: { select: { rating: true } }
      }
    },
    enrollments: {
      where: { status: EnrollmentStatus.PAID },
      select: { amountPaid: true }
    }
  }

  private readonly crewInclude = {
    course: {
      include: {
        introduction: { select: { coverImageUrl: true } },
        instructor: true,
        reviews: { select: { rating: true } }
      }
    },
    enrollments: { where: { status: EnrollmentStatus.PAID } }
  }

  private readonly courseWithSessionsSelect = {
    course: {
      select: {
        id: true,
        title: true,
        sessions: {
          orderBy: { sessionNumber: 'asc' }
        }
      }
    }
  } as const //Fixed TypeError

  constructor(private prisma: PrismaService) {}

  async findAllTracks() {
    return this.prisma.track.findMany({
      include: this.trackInclude,
      orderBy: { course: { createdAt: 'desc' } }
    })
  }

  async findAllCrews() {
    return this.prisma.crew.findMany({
      include: this.crewInclude,
      orderBy: { course: { createdAt: 'desc' } }
    })
  }

  async findTrackByCourseId(courseId: string) {
    return this.prisma.track.findUnique({
      where: { courseId },
      include: this.trackInclude,
    })
  }

  async findCrewByCourseId(courseId: string) {
    return this.prisma.crew.findUnique({
      where: { courseId },
      include: this.crewInclude,
    })
  }

  async findSessionsByTrackCourseId(courseId: string) {
    return this.prisma.track.findUnique({
      where: { courseId },
      select: this.courseWithSessionsSelect,
    })
  }

  async findSessionsByCrewCourseId(courseId: string) {
    return this.prisma.crew.findUnique({
      where: { courseId },
      select: this.courseWithSessionsSelect
    })
  }
}