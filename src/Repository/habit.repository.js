import { prisma } from "#db/prisma.js";


//습관 전체 조회
function findAllHabit() {
  return prisma.habit.findMany()
}

//studyId가 가진 habit가져오기 
function findHabitsByStudyId(studyId) {
  return prisma.habit.findMany({
    where: { studyId: String(studyId) }
  })
}

//오늘 유효한 리스트 가져오기 
function findTodayHabitsByStudyId(studyId) {
  return prisma.habit.findMany({
    where: {
      studyId: String(studyId)
    }
  })
}



export const habitRepository = {
  findAllHabit,
  findHabitsByStudyId,
  findTodayHabitsByStudyId
}