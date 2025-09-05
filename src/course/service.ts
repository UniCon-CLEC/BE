import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TrackCourseDto,
  CrewCourseDto,
  FundingCourseDto,
  CourseIntroductionDto,
  CourseCurriculumDto,
  CourseMaterialDto,
  CourseInstructorDto,
} from './dto';
import { CourseRepository } from './repository';
import { CourseFromDetails, CourseWithCurriculum, CourseWithInstructor, CourseWithIntroduction, CourseWithMaterial, CrewWithDetails, FundingWithDetails, TrackWithDetails } from './type';


@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
  ) {}

  async getAllTracks(): Promise<TrackCourseDto[]> {
    const tracks = await this.courseRepository.findAllTracks();
    return Promise.all(tracks.map((track) => this.toTrackCourseDto(track)));
  }

  async getAllCrews(): Promise<CrewCourseDto[]> {
    const crews = await this.courseRepository.findAllCrews();
    return Promise.all(crews.map((crew) => this.toCrewCourseDto(crew)));
  }

  async getAllFundings(): Promise<FundingCourseDto[]> {
    const fundings = await this.courseRepository.findAllFundings();
    return Promise.all(
      fundings.map((funding) => this.toFundingCourseDto(funding)),
    );
  }

  async getTrackByCourseId(courseId: string): Promise<TrackCourseDto> {
    const track = await this.courseRepository.findTrackByCourseId(courseId);
    if (!track) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 트랙을 찾을 수 없습니다`,
      );
    }
    return this.toTrackCourseDto(track);
  }

  async getCrewByCourseId(courseId: string): Promise<CrewCourseDto> {
    const crew = await this.courseRepository.findCrewByCourseId(courseId);
    if (!crew) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 크루를 찾을 수 없습니다`,
      );
    }
    return this.toCrewCourseDto(crew);
  }

  async getFundingByCourseId(courseId: string): Promise<FundingCourseDto> {
    const funding = await this.courseRepository.findFundingByCourseId(courseId);
    if (!funding) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 펀딩을 찾을 수 없습니다`,
      );
    }
    return this.toFundingCourseDto(funding);
  }

  async getIntroductionByCourseId(courseId: string): Promise<CourseIntroductionDto> {
    const course = await this.courseRepository.findIntroductionByCourseId(courseId);
    if (!course || !course.introduction) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 소개 정보를 찾을 수 없습니다`,
      );
    }
    return this.toIntroductionDto(course);
  }

  async getCurriculumByCourseId(courseId: string): Promise<CourseCurriculumDto> {
    const course = await this.courseRepository.findCurriculumByCourseId(courseId);
    if (!course) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 커리큘럼을 찾을 수 없습니다`,
      );
    }
    return this.toCurriculumDto(course);
  }

  async getMaterialByCourseId(courseId: string): Promise<CourseMaterialDto> {
    const course = await this.courseRepository.findMaterialByCourseId(courseId);
    if (!course) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 준비물을 찾을 수 없습니다`,
      );
    }
    return this.toMaterialDto(course);
  }

  async getInstructorByCourseId(courseId: string): Promise<CourseInstructorDto> {
    const course = await this.courseRepository.findInstructorByCourseId(courseId);
    if (!course || !course.instructor) {
      throw new NotFoundException(
        `코스 ID ${courseId}에 해당하는 강사 정보를 찾을 수 없습니다`,
      );
    }
    return this.toInstructorDto(course);
  }

  private toCommonCourseDto(course: CourseFromDetails){
    const averageRating =
      course.reviews.length > 0
        ? course.reviews.reduce((s, r) => s + r.rating, 0) /
          course.reviews.length
        : 0;

    return {
      courseId: course.id,
      title: course.title,
      instructor: course.instructor,
      courseStartDate: course.courseStartDate,
      averageRating: parseFloat(averageRating.toFixed(1)),
      coverImageUrl: course.introduction?.coverImageUrl,
      description: course.introduction?.description,
      scheduleDetails: course.introduction?.scheduleDetails,
      notices: course.notices,
      sessions: course.sessions,
      tags: course.tags.map((e) => e.name)
    }
  }

  private toTrackCourseDto(track: TrackWithDetails): TrackCourseDto {
    const common = this.toCommonCourseDto(track.course);

    return {
      ...common,
      status: track.status,
      tiers: track.tiers.map((e) => ({
        id: e.id,
        price: e.price.toNumber(),
        title: e.title,
        benefitDescription: e.benefitDescription
      }))
    }
  }

  private toCrewCourseDto(crew: CrewWithDetails): CrewCourseDto {
    const common = this.toCommonCourseDto(crew.course);

    return {
      ...common,
      status: crew.status,
      price: crew.price.toNumber(),
      studentCount: crew.enrollments.length
    }
  }

  private toFundingCourseDto(funding: FundingWithDetails): FundingCourseDto {
    const common = this.toCommonCourseDto(funding.course);

    const total = funding.enrollments.reduce(
      (s, e) => s + e.amountPaid.toNumber(), 0
    )

    const targetAmount = funding.fundingTargetAmount.toNumber()
    const achievementRate = 
      targetAmount > 0
        ? parseFloat(((total / targetAmount) * 100).toFixed(1))
        : 0
    
    return {
      ...common,
      status: funding.status,
      fundingTargetAmount: targetAmount,
      achievementRate,
      totalFundedAmount: total,
      fundingStartDate: funding.fundingStartDate,
      fundingEndDate: funding.fundingEndDate,
      postFundingPrice: funding.postFundingPrice
        ? funding.postFundingPrice.toNumber()
        : null,
      enrollmentCount: funding.enrollments.length,
      fundingTiers: funding.fundingTiers.map((e) => ({
        id: e.id,
        price: e.price.toNumber(),
        title: e.title,
        benefitDescription: e.benefitDescription
      }))
    }
  }

  private toIntroductionDto(course: CourseWithIntroduction): CourseIntroductionDto {
    return {
      blocks: course.introduction!.blocks.map(block => ({
        order: block.order,
        type: block.type,
        content: block.content,
        url: block.url
      }))
    };
  }

  private toCurriculumDto(course: CourseWithCurriculum): CourseCurriculumDto {
    return {
      sessions: course.sessions
    };
  }

  private toMaterialDto(course: CourseWithMaterial): CourseMaterialDto {
    return {
      supplies: course.supplies,
    };
  }

  private toInstructorDto(course: CourseWithInstructor): CourseInstructorDto {
    const { name, image, information, schedule } = course.instructor;
    return { name, image, information, schedule };
  }
}