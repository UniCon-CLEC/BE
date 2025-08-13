import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeResultDto, UpdateMeDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeResultDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tags: { select: { name: true } },
        enrollments: { 
          include: { 
            course: {
              include: {
                introduction: { select: { coverImageUrl: true } },
                instructor: { select: { information: true, name: true, id: true, image: true, schedule: true } },
                enrollments: { where: { status: 'PAID'}, select: { amountPaid: true } },
              }
            }
          }
        }
      }
    })

    // TODO: Apply Redis Cache by Using External PrivateFunction
    const enrolledCourses = user.enrollments.map((e) => {
      const { course } = e
      const currentFundingAmount = course.enrollments.reduce(
        (s, e) => s.add(e.amountPaid),
        new Decimal(0)
      )
      const targetAmount = course.fundingTargetAmount
      let fundingProgress = 0
      if (targetAmount.greaterThan(0))
        fundingProgress = Math.round(
          currentFundingAmount.div(targetAmount).toNumber() * 100
      );

      return {
        courseId: course.id,
        title: course.title,
        courseStatus: course.status,
        coverImageUrl: course.introduction?.coverImageUrl ?? null,
        instructor: course.instructor,
        enrollmentStatus: e.status,
        fundingProgress: fundingProgress,
        fundingStartDate: course.fundingStartDate,
        fundingEndDate: course.fundingEndDate,
        courseStartDate: course.courseStartDate
      }
    })

    const res: MeResultDto = {
      id: user.id,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      tags: user.tags.map((tag) => tag.name),
      enrolledCourses: enrolledCourses
    }

    return res 
  }
}