import { Prisma, CourseType, TrackStatus, Instructor } from '@prisma/client';

export async function seedTrack(tx: Prisma.TransactionClient, instructor: Instructor) {
  const trackCourse = await tx.course.create({
    data: {
      instructorId: instructor.id,
      title: 'Mock Track Course',
      type: CourseType.TRACK,
      courseStartDate: new Date('2025-10-01T09:00:00Z'),
      introduction: {
        create: {
          coverImageUrl: 'https://example.com/track-cover.jpg',
          description: 'Learn the fundamentals of software engineering.',
          scheduleDetails: 'Classes are held online every Tuesday and Thursday.',
        },
      },
      sessions: {
        create: [
          {
            sessionNumber: 1,
            title: 'Introduction to Programming',
            content: 'This is the first session.',
          },
          {
            sessionNumber: 2,
            title: 'Data Structures',
            content: 'This is the second session.',
          },
        ],
      },
      track: {
        create: {
          status: TrackStatus.PREPARING,
          fundingTargetAmount: 5000,
          fundingStartDate: new Date('2025-09-01T09:00:00Z'),
          fundingEndDate: new Date('2025-09-30T09:00:00Z'),
        },
      },
    },
    include: { introduction: true, sessions: true, track: true },
  });

  console.log(`Created track course: ${trackCourse.title} (ID: ${trackCourse.id})`);
  return trackCourse;
}
