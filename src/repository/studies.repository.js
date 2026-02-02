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

//오늘의 습관
//특정 study(id)의 정보(id, name, nickname)와 연관된 habits를 조회
function findStudyWithHabits(id) {
  return prisma.study.findUnique({
    where: { id: String(id) },
    select: {
      id: true,
      name: true,
      nickname: true,
      habits: {
        where: {
          isDeleted: false,
        }
      },
    },
  });
}

function fetchAllResources(id) {
  return prisma.study.findUnique({
    where: { id: String(id) },
    include: {
      habits: {
        include: { records: true },
      },
      emojiLogs: true,
    },
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
  findStudyWithHabits,
  fetchAllResources,
  findStudyWithTopEmojis,
  upsertEmoji,
  addPoints
};
