import { Prisma } from '@prisma/client';

export async function seedInstructors(tx: Prisma.TransactionClient) {
  const instructor = await tx.instructor.create({
    data: {
      name: 'Mock Instructor',
      image: 'https://example.com/instructor.jpg',
      information: 'This is a mock instructor for testing purposes.',
      schedule: 'Mon-Fri, 9am-5pm',
    },
  });

  console.log(`Created instructor: ${instructor.name} (ID: ${instructor.id})`);
  return instructor;
}
