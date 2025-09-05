import {
  PrismaClient,
  CourseType,
  FundingStatus,
  CourseLifecycleStatus,
  BlockType,
} from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CourseIntroBlockData {
  order: number;
  type: 'TEXT' | 'IMAGE';
  content?: string;
  url?: string;
}

interface IntroductionData {
  coverImageUrl: string;
  description: string;
  scheduleDetails: string;
  blocks: CourseIntroBlockData[];
}

interface TierData {
  price: number;
  title?: string;
  benefitDescription: string;
}

interface CourseData {
  type: 'FUNDING' | 'TRACK' | 'CREW';
  title: string;
  courseStartDate: string;
  instructorId: string;
  tagIds: number[];
  introduction: IntroductionData;
  fundingDetails?: {
    status: 'FUNDING' | 'PREPARING' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
    fundingTargetAmount: number;
    fundingStartDate: string;
    fundingEndDate: string;
    postFundingPrice?: number;
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
  instructors: { id: string; name: string; image?: string; information?: string }[];
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
    await prisma.instructor.upsert({
      where: { id: instructorData.id },
      update: {
        name: instructorData.name,
        image: instructorData.image,
        information: instructorData.information,
      },
      create: instructorData,
    });
  }
  console.log(
    `${input.instructors.length}명의 강사 정보가 생성 또는 업데이트되었습니다.`,
  );

  for (const courseData of input.courses) {
    const { instructorId } = courseData;
    if (!instructorId) {
      console.warn(`instructorId가 없어 '${courseData.title}' 코스를 건너뜁니다.`);
      continue;
    }

    const type = CourseType[courseData.type];
    const courseStartDate = new Date(courseData.courseStartDate);
    const tagsToConnect = courseData.tagIds.map((id) => ({ id }));

    const introductionCreateInput = {
      ...courseData.introduction,
      blocks: {
        create: courseData.introduction.blocks.map((block) => ({
          ...block,
          type: BlockType[block.type],
        })),
      },
    };

    const introductionUpdateInput = {
      ...courseData.introduction,
      blocks: {
        deleteMany: {},
        create: courseData.introduction.blocks.map((block) => ({
          ...block,
          type: BlockType[block.type],
        })),
      },
    };

    const existingCourse = await prisma.course.findFirst({
      where: { title: courseData.title },
    });

    if (existingCourse) {
      // --- 코스 업데이트 로직 ---
      await prisma.course.update({
        where: { id: existingCourse.id },
        data: {
          type,
          courseStartDate,
          instructor: { connect: { id: instructorId } },
          tags: { set: tagsToConnect },
          introduction: {
            upsert: {
              create: introductionCreateInput,
              update: introductionUpdateInput,
            },
          },
          funding:
            courseData.type === 'FUNDING' && courseData.fundingDetails
              ? {
                  upsert: {
                    create: {
                      status: FundingStatus[courseData.fundingDetails.status],
                      fundingTargetAmount: courseData.fundingDetails.fundingTargetAmount,
                      fundingStartDate: new Date(courseData.fundingDetails.fundingStartDate),
                      fundingEndDate: new Date(courseData.fundingDetails.fundingEndDate),
                      postFundingPrice: courseData.fundingDetails.postFundingPrice,
                      fundingTiers: { create: courseData.fundingDetails.tiers },
                    },
                    update: {
                      status: FundingStatus[courseData.fundingDetails.status],
                      fundingTargetAmount: courseData.fundingDetails.fundingTargetAmount,
                      fundingStartDate: new Date(courseData.fundingDetails.fundingStartDate),
                      fundingEndDate: new Date(courseData.fundingDetails.fundingEndDate),
                      postFundingPrice: courseData.fundingDetails.postFundingPrice,
                    },
                  },
                }
              : undefined,
          track:
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
              : undefined,
          crew:
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
              : undefined,
        },
      });
    } else {
      // --- 코스 생성 로직 ---
      await prisma.course.create({
        data: {
          title: courseData.title,
          type,
          courseStartDate,
          instructor: { connect: { id: instructorId } },
          tags: { connect: tagsToConnect },
          introduction: {
            create: introductionCreateInput,
          },
          funding:
            courseData.type === 'FUNDING' && courseData.fundingDetails
              ? {
                  create: {
                    status: FundingStatus[courseData.fundingDetails.status],
                    fundingTargetAmount: courseData.fundingDetails.fundingTargetAmount,
                    fundingStartDate: new Date(courseData.fundingDetails.fundingStartDate),
                    fundingEndDate: new Date(courseData.fundingDetails.fundingEndDate),
                    postFundingPrice: courseData.fundingDetails.postFundingPrice,
                    fundingTiers: { create: courseData.fundingDetails.tiers },
                  },
                }
              : undefined,
          track:
            courseData.type === 'TRACK' && courseData.trackDetails
              ? {
                  create: {
                    status: CourseLifecycleStatus[courseData.trackDetails.status],
                    tiers: { create: courseData.trackDetails.tiers },
                  },
                }
              : undefined,
          crew:
            courseData.type === 'CREW' && courseData.crewDetails
              ? {
                  create: {
                    status: CourseLifecycleStatus[courseData.crewDetails.status],
                    price: courseData.crewDetails.price,
                  },
                }
              : undefined,
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