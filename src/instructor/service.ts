import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InstructorRepository } from './repository';
import { CreateTrackDto, CreateCrewDto, InstructorDto, CourseInfoDto } from './dto';
import { Instructor, Course, CourseType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstructorService {
  constructor(
    private readonly instructorRepository: InstructorRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getInstructorById(id: string): Promise<InstructorDto> {
    const instructor = await this.instructorRepository.findById(id);
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return this.toInstructorDto(instructor);
  }

  async createTrack(instructorId: string, createTrackDto: CreateTrackDto) {
    const { title, courseStartDate, status, fundingTargetAmount, fundingStartDate, fundingEndDate } = createTrackDto;

    return this.prisma.course.create({
      data: {
        instructorId,
        title,
        type: CourseType.TRACK,
        courseStartDate,
        track: {
          create: {
            status: status || 'PREPARING',
            fundingTargetAmount: fundingTargetAmount || 0,
            fundingStartDate: fundingStartDate || new Date(),
            fundingEndDate: fundingEndDate || new Date(),
          }
        },
      },
      include: {
        track: true,
      }
    });
  }

  async createCrew(instructorId: string, createCrewDto: CreateCrewDto) {
    const { title, courseStartDate, status, price } = createCrewDto;

    return this.prisma.course.create({
      data: {
        instructorId,
        title,
        type: CourseType.CREW,
        courseStartDate,
        crew: {
          create: {
            status: status || 'PREPARING',
            price: price || 0,
          }
        },
      },
      include: {
        crew: true,
      }
    });
  }

  private toInstructorDto(instructor: Instructor & { courses: Course[] }): InstructorDto {
    const courseInfos: CourseInfoDto[] = instructor.courses.map(course => ({
        id: course.id,
        title: course.title,
        type: course.type,
        courseStartDate: course.courseStartDate,
    }));

    return {
        id: instructor.id,
        name: instructor.name,
        image: instructor.image,
        information: instructor.information,
        schedule: instructor.schedule,
        courses: courseInfos,
    };
  }
}
