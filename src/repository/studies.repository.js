import { prisma } from '#db/prisma.js';

// 1. 목록 조회 및 카운트 (기존 코드)
async function findAndCountAll({ where, orderBy, take, skip }) {
  const [studies, totalCount] = await Promise.all([
    prisma.study.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        emojiLogs: true,
      },
    }),
    prisma.study.count({
      where,
    }),
  ]);
  return { studies, totalCount };
}

// 2. 스터디 생성
function createStudy(data) {
  return prisma.study.create({
    data,
  });
}

// 3. ID로 스터디 찾기
function findStudyById(id) {
  return prisma.study.findUnique({
    where: { id: id },
  });
}

// 4. 스터디 수정
function updateStudy(id, data) {
  return prisma.study.update({
    where: { id: id },
    data,
  });
}

// 5. 스터디 삭제
function deleteStudy(id) {
  return prisma.study.delete({
    where: { id: id },
  });
}

// 마지막에 한 번에 export
export const studiesRepository = {
  findAndCountAll,
  createStudy,
  findStudyById,
  updateStudy,
  deleteStudy,
};