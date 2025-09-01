import {
  PrismaClient,
  CourseType,
  FundingStatus,
  CourseLifecycleStatus,
} from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface TierData {
  price: number;
  benefitDescription: string;
}

// CourseData 인터페이스 수정
interface CourseData {
  type: 'FUNDING' | 'TRACK' | 'CREW';
  title: string;
  courseStartDate: string;
  instructorName: string;
  tagIds: number[];
  // introduction 객체 추가
  introduction: {
    coverImageUrl: string;
    description: string;
    scheduleDetails: string;
  };
  fundingDetails?: {
    status: 'FUNDING' | 'PREPARING' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
    fundingTargetAmount: number;
    fundingStartDate: string;
    fundingEndDate: string;
    tiers: TierData[];
  };
  trackDetails?: {
    status: 'PREPARING' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
    tiers: TierData[];
  };
  crewDetails?: {
    status: 'PREPARING' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
    price: number;
  };
}

interface InputData {
  instructors: { name: string }[];
  courses: CourseData[];
}

function loadInputData(): InputData {
  const rawData = fs.readFileSync(path.join(__dirname, 'input.json'), 'utf-8');
  return JSON.parse(rawData);
}

async function deleteCoursesAndInstructors() {
  await prisma.course.deleteMany();
  await prisma.instructor.deleteMany();
  console.log('모든 코스와 강사 데이터가 삭제되었습니다. (태그는 유지됩니다)');
}

async function createData() {
  const input = loadInputData();

  for (const instructorData of input.instructors) {
    const existingInstructor = await prisma.instructor.findFirst({
      where: { name: instructorData.name },
    });

    if (!existingInstructor) {
      await prisma.instructor.create({
        data: { name: instructorData.name },
      });
    }
  }
  console.log(
    `${input.instructors.length}명의 강사 정보가 생성 또는 확인되었습니다.`,
  );

  const instructors = await prisma.instructor.findMany();
  const instructorMap = new Map(instructors.map((i) => [i.name, i.id]));

 for (const courseData of input.courses) {
    const instructorId = instructorMap.get(courseData.instructorName);
    if (!instructorId) {
      console.warn(
        `'${courseData.instructorName}' 강사를 찾을 수 없어 코스를 건너뜁니다.`,
      );
      continue;
    }

    const tagsPayload = courseData.tagIds.map((id) => ({ id }));
    const type = CourseType[courseData.type];
    const courseStartDate = new Date(courseData.courseStartDate);
    const instructorPayload = { connect: { id: instructorId } };

    const introductionPayload = {
      upsert: {
        create: courseData.introduction,
        update: courseData.introduction,
      },
    };

    const fundingPayload =
      courseData.type === 'FUNDING' && courseData.fundingDetails
        ? {
            upsert: {
              create: {
                status: FundingStatus[courseData.fundingDetails.status],
                fundingTargetAmount:
                  courseData.fundingDetails.fundingTargetAmount,
                fundingStartDate: new Date(
                  courseData.fundingDetails.fundingStartDate,
                ),
                fundingEndDate: new Date(
                  courseData.fundingDetails.fundingEndDate,
                ),
                fundingTiers: {
                  create: courseData.fundingDetails.tiers,
                },
              },
              update: {
                status: FundingStatus[courseData.fundingDetails.status],
                fundingTargetAmount:
                  courseData.fundingDetails.fundingTargetAmount,
                fundingStartDate: new Date(
                  courseData.fundingDetails.fundingStartDate,
                ),
                fundingEndDate: new Date(
                  courseData.fundingDetails.fundingEndDate,
                ),
              },
            },
          }
        : undefined;

    const trackPayload =
      courseData.type === 'TRACK' && courseData.trackDetails
        ? {
            upsert: {
              create: {
                status: CourseLifecycleStatus[courseData.trackDetails.status],
                tiers: { create: courseData.trackDetails.tiers },
              },
              update: {
                status: CourseLifecycleStatus[courseData.trackDetails.status],
              },
            },
          }
        : undefined;

    const crewPayload =
      courseData.type === 'CREW' && courseData.crewDetails
        ? {
            upsert: {
              create: {
                status: CourseLifecycleStatus[courseData.crewDetails.status],
                price: courseData.crewDetails.price,
              },
              update: {
                status: CourseLifecycleStatus[courseData.crewDetails.status],
                price: courseData.crewDetails.price,
              },
            },
          }
        : undefined;

    const existingCourse = await prisma.course.findFirst({
      where: { title: courseData.title },
    });

    if (existingCourse) {
      await prisma.course.update({
        where: { id: existingCourse.id },
        data: {
          type,
          courseStartDate,
          instructor: instructorPayload,
          tags: { set: tagsPayload },
          introduction: introductionPayload,
          funding: fundingPayload,
          track: trackPayload,
          crew: crewPayload,
        },
      });
    } else {
     await prisma.course.create({
        data: {
          title: courseData.title,
          type,
          courseStartDate,
          instructor: instructorPayload,
          tags: { connect: tagsPayload },
          introduction: { create: courseData.introduction },
          funding: fundingPayload ? { create: fundingPayload.upsert.create } : undefined,
          track: trackPayload ? { create: trackPayload.upsert.create } : undefined,
          crew: crewPayload ? { create: crewPayload.upsert.create } : undefined,
        },
      });
    }
  }
  console.log(
    `${input.courses.length}개의 코스가 성공적으로 생성 또는 업데이트되었습니다.`,
  );
}

async function main() {
  const action = process.argv[2];

  if (action === 'create') {
    await createData();
  } else if (action === 'delete') {
    await deleteCoursesAndInstructors();
  } else {
    console.log('명령어를 입력해주세요: "create" 또는 "delete"');
  }
}

main()
  .catch((e) => {
    console.error('스크립트 실행 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });