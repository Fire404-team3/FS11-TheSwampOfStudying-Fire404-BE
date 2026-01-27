import { prisma } from '#db/prisma.js';

//studies.ropository.js

//특정 study(id)의 정보(id, name, nickname)와 연관된 habits를 조회
function findStudyWithHabits(id) {
  return prisma.study.findUnique({
    where: { id: String(id) },
    select: {
      // id: true,
      name: true,
      nickname: true,
      habits: true,
    },
  });
}

export const studiesRepository = {
  findStudyWithHabits,
};


