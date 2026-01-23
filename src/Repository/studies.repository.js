
import { prisma } from '#db/prisma.js';





//studies.ropository.js
export function findstudyWithHabits(id) {
  return prisma.study.findUnique({
    where: { id: String(id) },
    select: {
      id: true,
      name: true,
      nickname:true,
      habits: true,
    },
  });
}


export const habitsRepository = {

  findstudyWithHabits,
};
