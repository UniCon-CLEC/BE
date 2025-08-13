const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');
const path = require('path');

const hierarchicalTagData = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'input_tags.json'), 'utf-8')
);

const prisma = new PrismaClient();

async function main() {
  const parentTagIdMap = new Map();

  try {
    console.log('1. 부모 태그 생성 또는 업데이트 시작...');
    for (const parentTag of hierarchicalTagData) {
      const createdTag = await prisma.tag.upsert({
        where: { name: parentTag.name },
        update: {}, // 업데이트할 내용이 없으므로 빈 객체
        create: {
          name: parentTag.name,
        },
      });
      parentTagIdMap.set(parentTag.name, createdTag.id);
      console.log(`  -> 부모 태그 '${parentTag.name}' 처리 완료, ID: ${createdTag.id}`);
    }

    console.log('\n2. 자식 태그 생성 또는 업데이트 시작...');
    for (const parentTag of hierarchicalTagData) {
      const parentId = parentTagIdMap.get(parentTag.name);
      if (!parentId) {
        console.error(`  - 오류: 부모 태그 '${parentTag.name}'의 ID를 찾을 수 없습니다.`);
        continue;
      }

      for (const childName of parentTag.children) {
        await prisma.tag.upsert({
          where: { name: childName },
          update: { parentId: parentId }, // 혹시 부모가 바뀌었을 경우 업데이트
          create: {
            name: childName,
            parentId: parentId,
          },
        });
        console.log(`  -> 자식 태그 '${childName}'를 부모 '${parentTag.name}'에 연결`);
      }
    }
    console.log("\n✅ 모든 태그 데이터 삽입 완료!");
  } catch (e) {
    console.error("데이터 처리 중 오류가 발생했습니다:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
