//오늘의 습관 체크 토글 생성 레포지토리

import { prisma } from '#db/prisma.js';

//다시해라...
//오늘의 습관 체크 토글 생성 
function toggleHabitCheckDate(habitId, checkDate) {
  const today = new Date(checkDate)
    return prisma.habitRecord.create({
      data: {
        habitId,
        checkDate: new Date(today),
      },
    });
  }

//오늘의 습관 체크 토글 삭제 
async function deleteHabitCheckDate(habitId, checkDate) {
  const date = new Date(checkDate)

  const startDay = new Date(date)
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date(date)
  endDay.setHours(23, 59, 59, 999)
  
  const checkRecord = await prisma.habitRecord.findFirst({
    where: {
      habitId,
      checkDate: {
        gte: startDay,
        lt: endDay,
      }
    }
  });

  if (!checkRecord) return null;

  return prisma.habitRecord.delete({
    where:{id: checkRecord.id},
  })
  
}

export const habitsRepository = {
  toggleHabitCheckDate,
  deleteHabitCheckDate
};
