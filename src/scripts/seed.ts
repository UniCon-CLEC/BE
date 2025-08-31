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

interface CourseData {
  type: 'FUNDING' | 'TRACK' | 'CREW';
  title: string;
  courseStartDate: string;
  instructorName: string;
  tagIds: number[];
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

  // 1. 강사 정보를 생성합니다.
  await prisma.instructor.createMany({
    data: input.instructors,
    skipDuplicates: true,
  });
  console.log(`${input.instructors.length}명의 강사 정보가 생성되었습니다.`);

  // 2. 생성된 강사의 ID를 가져와서 Map에 저장합니다.
  const instructors = await prisma.instructor.findMany();
  const instructorMap = new Map(instructors.map((i) => [i.name, i.id]));

  // 3. 코스를 생성합니다.
  for (const courseData of input.courses) {
    const instructorId = instructorMap.get(courseData.instructorName);
    if (!instructorId) {
      console.warn(`'${courseData.instructorName}' 강사를 찾을 수 없어 코스를 건너뜁니다.`);
      continue;
    }

    const tagsToConnect = courseData.tagIds.map((id) => ({ id }));

    await prisma.course.create({
      data: {
        title: courseData.title,
        type: CourseType[courseData.type],
        courseStartDate: new Date(courseData.courseStartDate),
        instructor: {
          connect: { id: instructorId },
        },
        tags: {
          connect: tagsToConnect,
        },
        // Funding 타입 코스인 경우 funding 정보를 함께 생성
        ...(courseData.type === 'FUNDING' && courseData.fundingDetails
          ? {
              funding: {
                create: {
                  status: FundingStatus[courseData.fundingDetails.status],
                  fundingTargetAmount: courseData.fundingDetails.fundingTargetAmount,
                  fundingStartDate: new Date(courseData.fundingDetails.fundingStartDate),
                  fundingEndDate: new Date(courseData.fundingDetails.fundingEndDate),
                  fundingTiers: {
                    create: courseData.fundingDetails.tiers.map((tier) => ({
                      price: tier.price,
                      benefitDescription: tier.benefitDescription,
                    })),
                  },
                },
              },
            }
          : {}),

        ...(courseData.type === 'TRACK' && courseData.trackDetails
          ? {
              track: {
                create: {
                  status: CourseLifecycleStatus[courseData.trackDetails.status],
                  tiers: {
                    create: courseData.trackDetails.tiers.map((tier) => ({
                      price: tier.price,
                      benefitDescription: tier.benefitDescription,
                    })),
                  },
                },
              },
            }
          : {}),
        ...(courseData.type === 'CREW' && courseData.crewDetails
          ? {
              crew: {
                create: {
                  status: CourseLifecycleStatus[courseData.crewDetails.status],
                  price: courseData.crewDetails.price,
                },
              },
            }
          : {}),
      },
    });
  }
  console.log(`${input.courses.length}개의 코스가 성공적으로 생성되었습니다.`);
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