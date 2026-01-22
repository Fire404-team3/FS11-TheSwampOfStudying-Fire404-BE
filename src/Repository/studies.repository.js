import { prisma } from '#db/prisma.js';

//studyId가 가진 habit가져오기 daily
function findHabitsByStudyId(studyId) {
  return prisma.habit.findMany({
    where: { studyId: String(studyId) },
  });
}

export const studiesRepository = {
  findHabitsByStudyId,
};
