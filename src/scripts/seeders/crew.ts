import { Prisma, CourseType, Instructor } from '@prisma/client';

export async function seedCrew(tx: Prisma.TransactionClient, instructor: Instructor) {
  const crewCourse = await tx.course.create({
    data: {
      instructorId: instructor.id,
      title: 'Mock Crew Course',
      type: CourseType.CREW,
      courseStartDate: new Date('2025-11-01T09:00:00Z'),
      introduction: {
        create: {
          coverImageUrl: 'https://example.com/crew-cover.jpg',
          description: 'Join our crew to build a real-world application.',
          scheduleDetails: 'We meet every Wednesday for a hands-on session.',
        },
      },
      sessions: {
        create: [
          {
            sessionNumber: 1,
            title: 'Project Setup',
            content: 'Setting up the development environment.',
          },
          {
            sessionNumber: 2,
            title: 'Backend Development',
            content: 'Building the API.',
          },
        ],
      },
      crew: {
        create: {
          status: 'PREPARING',
          price: 200,
        },
      },
    },
    include: { introduction: true, sessions: true, crew: true },
  });

  console.log(`Created crew course: ${crewCourse.title} (ID: ${crewCourse.id})`);
  return crewCourse;
}
