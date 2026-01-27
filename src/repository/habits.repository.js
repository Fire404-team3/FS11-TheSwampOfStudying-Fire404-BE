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


export const habitsRepository = {
  toggleHabitCheckDate,
};
