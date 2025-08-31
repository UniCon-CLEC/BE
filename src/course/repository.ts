import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  crewInclude,
  fundingInclude,
  trackInclude,
} from './type';

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTracks() {
    return this.prisma.track.findMany({
      include: trackInclude,
      orderBy: { course: { createdAt: 'desc' } },
    });
  }

  async findAllCrews() {
    return this.prisma.crew.findMany({
      include: crewInclude,
      orderBy: { course: { createdAt: 'desc' } },
    });
  }

  async findAllFundings() {
    return this.prisma.funding.findMany({
      include: fundingInclude,
      orderBy: { course: { createdAt: 'desc' } },
    });
  }

  async findTrackByCourseId(courseId: string) {
    return this.prisma.track.findUnique({
      where: { courseId },
      include: trackInclude,
    });
  }

  async findCrewByCourseId(courseId: string) {
    return this.prisma.crew.findUnique({
      where: { courseId },
      include: crewInclude,
    });
  }

  async findFundingByCourseId(courseId: string) {
    return this.prisma.funding.findUnique({
      where: { courseId },
      include: fundingInclude,
    });
  }
}