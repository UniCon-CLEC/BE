import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackDto, CrewDto, CourseSessionDto, CourseDetailSessionsDto } from './dto';
import { CourseRepository } from './repository';
import { CrewWithDetails, TrackWithDetails } from './type';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseRepository: CourseRepository
  ) {}

  async getAllTracks(): Promise<TrackDto[]> {
    const tracks = await this.courseRepository.findAllTracks()
    return Promise.all(tracks.map((track) => this.toTrackDto(track)))
  }

  async getAllCrews(): Promise<CrewDto[]> {
    const crews = await this.courseRepository.findAllCrews()
    return Promise.all(crews.map((crew) => this.toCrewDto(crew)))
  }

  async getTrackByCourseId(courseId: string): Promise<TrackDto> {
    const track = await this.courseRepository.findTrackByCourseId(courseId)
    if (!track) {
      throw new NotFoundException(`코스 ID ${courseId}에 해당하는 트랙을 찾을 수 없습니다`)
    }
    return this.toTrackDto(track)
  }

  async getCrewByCourseId(courseId: string): Promise<CrewDto> {
    const crew = await this.courseRepository.findCrewByCourseId(courseId)
    if (!crew) {
      throw new NotFoundException(`코스 ID ${courseId}에 해당하는 크루를 찾을 수 없습니다`)
    }
    return this.toCrewDto(crew)
  }

  async getTrackSessionsByCourseId(courseId: string): Promise<CourseDetailSessionsDto> {
    const result = await this.courseRepository.findSessionsByTrackCourseId(courseId)
    if (!result || !result.course) 
      throw new NotFoundException(`코스 ID ${courseId}에 해당하는 트랙의 세션을 찾을 수 없습니다`)
    const { course } = result

    const courseDetail: CourseDetailSessionsDto = {
      courseId: course.id,
      title: course.title,
      sessions: course.sessions.map(
        (e) => ({
          sessionNumber: e.sessionNumber,
          title: e.title
        })
      )
    }

    return courseDetail
  }
  
  async getCrewSessionsByCourseId(courseId: string): Promise<CourseDetailSessionsDto> {
    const result = await this.courseRepository.findSessionsByCrewCourseId(courseId)
    if (!result || !result.course) 
      throw new NotFoundException(`코스 ID ${courseId}에 해당하는 크루의 세션을 찾을 수 없습니다`)
    const { course } = result

    const courseDetail: CourseDetailSessionsDto = {
      courseId: course.id,
      title: course.title,
      sessions: course.sessions.map(
        (e) => ({
          sessionNumber: e.sessionNumber,
          title: e.title
        })
      )
    }

    return courseDetail
  }



  private toTrackDto(track: TrackWithDetails): TrackDto {
    const { course } = track

    const currentFundingAmount = track.enrollments.reduce(
      (sum, e) => sum.add(e.amountPaid),
      new Decimal(0)
    )
    const targetAmount = track.fundingTargetAmount
    let fundingProgress = 0
    if (targetAmount.greaterThan(0)) {
      fundingProgress = Math.round(
        currentFundingAmount.div(targetAmount).toNumber() * 100
      )
    }

    const averageRating = course.reviews.length
      ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
      : 0

    return {
      courseId: course.id,
      title: course.title,
      instructor: course.instructor,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      courseStartDate: course.courseStartDate,
      averageRating: parseFloat(averageRating.toFixed(1)),
      status: track.status,
      fundingProgress,
      fundingTargetAmount: track.fundingTargetAmount.toNumber(),
      currentFundingAmount: currentFundingAmount.toNumber(),
      fundingStartDate: track.fundingStartDate,
      fundingEndDate: track.fundingEndDate
    }
  }

  private toCrewDto(crew: CrewWithDetails): CrewDto {
    const { course } = crew
    const reviews = course.reviews

    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return {
      courseId: course.id,
      title: course.title,
      instructor: course.instructor,
      coverImageUrl: course.introduction?.coverImageUrl ?? null,
      courseStartDate: course.courseStartDate,
      averageRating: parseFloat(averageRating.toFixed(1)),
      status: crew.status,
      price: crew.price.toNumber(),
      studentCount: crew.enrollments.length
    }
  }

}
