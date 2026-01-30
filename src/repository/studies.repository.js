import { prisma } from '#db/prisma.js';

async function findAndCountAll({ where, orderBy, take, skip }) {
  const [studies, totalCount] = await Promise.all([
    prisma.study.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        emojiLogs: {
          orderBy: { count: 'desc' },
          take: 3,
        },
      },
    }),
    prisma.study.count({
      where,
    }),
  ]);
  return { studies, totalCount };
}

function createStudy(data) {
  return prisma.study.create({
    data,
  });
}

function findStudyById(id) {
  return prisma.study.findUnique({
    where: { id: id },
  });
}

function updateStudy(id, data) {
  return prisma.study.update({
    where: { id: id },
    data,
  });
}

function deleteStudy(id) {
  return prisma.study.delete({
    where: { id: id },
  });
}

// 스터디 상세 조회 + Top3 이모지
function findStudyWithTopEmojis(id) {
  return prisma.study.findUnique({
    where: { id },
    include: {
      emojiLogs: {
        orderBy: { count: 'desc' },
        take: 3,
      },
    },
  });
}

// 해당 이모지 있으면 +1, 없으면 생성
function upsertEmoji(studyId, emojiType) {
  return prisma.emojiLog.upsert({
    where: {
      studyId_emojiType: {
        studyId,
        emojiType,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      studyId,
      emojiType,
      count: 1,
    },
  });
}

// 포인트 적립
function addPoints(id, earnedPoints) {
  return prisma.study.update({
    where: { id },
    data: {
      points: {
        increment: earnedPoints,
      },
    },
  });
}

export const studiesRepository = {
  findAndCountAll,
  createStudy,
  findStudyById,
  updateStudy,
  deleteStudy,
  findStudyWithTopEmojis,
  upsertEmoji,
  addPoints,
};
