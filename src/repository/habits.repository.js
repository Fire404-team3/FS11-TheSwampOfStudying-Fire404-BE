// transaction 처리전 데이타 확인
export const findActiveByStudyId = (tx, studyId) => {
  return tx.habit.findMany({
    where: {
      studyId,
      isDeleted: false,
    },
  });
};

// 삭제 처리 : isDelteted를 true로 설정
export const deleteHabits = (tx, habits) => {
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
export const createHabits = (tx, studyId, habits) => {
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
export const updateHabits = (tx, habits) => {
  return Promise.all(
    habits.map((habit) =>
      tx.habit.update({
        where: { id: habit.id },
        data: { name: habit.name },
      }),
    ),
  );
}
