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

export const studiesRepository = {
  findAndCountAll,
  createStudy,
  findStudyById,
  updateStudy,
  deleteStudy,
};
