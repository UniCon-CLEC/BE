const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function createTags() {
  const input = JSON.parse(fs.readFileSync(path.join(__dirname, 'input.json'), 'utf-8'));
  const createdTags = await prisma.tag.createMany({
    data: input.tags.map((tag) => ({ name: tag.name, parentId: tag.parentId})),
    skipDuplicates: true,
  });
  console.log(`Created ${createdTags.count} tags`);
}

async function deleteTags(tagIds) {
  const deletedTags = await prisma.tag.deleteMany({
    where: {
      id: {
        in: tagIds,
      },
    },
  });
  console.log(`Deleted ${deletedTags.count} tags`);
}

async function main() {
  const action = process.argv[2];

  if (action === 'create') {
    await createTags();
  } else if (action === 'delete') {
    const ids = process.argv.slice(3).map(id => parseInt(id, 10));
    if(ids.length === 0) {
        console.log('Please provide tag ids to delete');
        return;
    }
    await deleteTags(ids);
  } else {
    console.log('Please specify an action: create or delete');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });