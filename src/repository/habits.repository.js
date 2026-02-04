import { prisma } from '#db/prisma.js';

// transaction 처리전 데이타 확인
const findActiveByStudyId = (tx, studyId) => {
  return tx.habit.findMany({
    where: {
      studyId,
      isDeleted: false,
    },
  });
};

// 습관 단독 삭제 시, 과거 기록 보존을 위한 논리 삭제(Soft Delete) 처리
// PR 반영 : update -> updateMany
const deleteHabits = (tx, habits) => {
  const ids = habits.map((h) => h.id);
  if (ids.length === 0) return Promise.resolve();
  return tx.habit.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      isDeleted: true,
    },
  });
};

// habit 신규 생성 - 변경전 createUnique => createMany
const createHabits = (tx, studyId, habits) => {
  return tx.habit.createMany({
    data: habits.map((habit) => ({
      studyId,
      name: habit.name,
    })),
    skipDuplicates: true,
  });
};

// Habit name 수정  //PR반영 promise.all 제외
const updateHabits = (tx, habits) => {
  return habits.map((habit) =>
    tx.habit.update({
      where: { id: habit.id },
      data: { name: habit.name },
    }),
  );
};

//오늘의 습관 체크 토글 생성 레포지토리

//오늘의 습관 체크 토글 생성
function toggleHabitCheckDate(habitId, checkDate) {
  const today = new Date(checkDate);
  return prisma.habitRecord.create({
    data: {
      habitId,
      checkDate: new Date(today),
    },
  });
}

//오늘의 습관 체크 토글 삭제
async function deleteHabitCheckDate(habitId, checkDate) {
  const date = new Date(checkDate);

  const startDay = new Date(date);
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date(date);
  endDay.setHours(23, 59, 59, 999);

  const checkRecord = await prisma.habitRecord.findFirst({
    where: {
      habitId,
      checkDate: {
        gte: startDay,
        lt: endDay,
      },
    },
  });

  if (!checkRecord) return null;

  return prisma.habitRecord.delete({
    where: { id: checkRecord.id },
  });
}

function findHabitById(id) {
  return prisma.habit.findUnique({
    where: { id: id },
  });
}

export const habitsRepository = {
  findActiveByStudyId,
  deleteHabits,
  createHabits,
  updateHabits,
  toggleHabitCheckDate,
  deleteHabitCheckDate,
  findHabitById,
};
