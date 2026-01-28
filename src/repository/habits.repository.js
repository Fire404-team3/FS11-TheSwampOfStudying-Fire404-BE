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
const deleteHabits = (tx, habits) => {
  return Promise.all(
    habits.map((habit) =>
      tx.habit.update({
        where: { id: habit.id },
        data: { isDeleted: true },
      }),
    ),
  );
};

// habit 신규 생성
const createHabits = (tx, studyId, habits) => {
  return Promise.all(
    habits.map((habit) =>
      tx.habit.create({
        data: {
          studyId,
          name: habit.name,
        },
      }),
    ),
  );
};

// Habit name 수정
const updateHabits = (tx, habits) => {
  return Promise.all(
    habits.map((habit) =>
      tx.habit.update({
        where: { id: habit.id },
        data: { name: habit.name },
      }),
    ),
  );
};

export const habitsRepository = {
  findActiveByStudyId,
  deleteHabits,
  createHabits,
  updateHabits
}
