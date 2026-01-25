// 특정 Study의 습관을 삭제/신규/수정을 동기화 처리하기 위한 로직입니다

import { prisma } from '#db/prisma.js';
import { HTTP_STATUS } from '#constants';

// transaction처리전 데이타 확인
export const findActiveByStudyId = (tx, studyId) => {
  return tx.habit.findMany({
    where: {
      studyId,
      isDeleted: false,
    },
  });
};

// 라우터에 의해 실행되는 PUT의 실제 처리 로직
export const syncHabitsByStudy = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const habits = req.body;

    //방어 코드 : habit이름이 빈공백인 경우 ""인 경우의 입력 차단-postman등 외부 유입
    for (const habit of habits) {
      if (!habit.name || habit.name.trim() === '') {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: '습관 이름은 필수입니다.' });
      }
    }
    await prisma.$transaction(async (tx) => {
      //기존 Habit중 현재 isDelted:False 전체습관 조회
      const existingHabits = await findActiveByStudyId(tx, studyId);
  
      // Delted 처리할 대상을 선별 - 새로 넘어오지 않은 Habits 추출(isDeleted : true처리 목적)
      const habitsToDelete = existingHabits.filter(
        (existingHabit) =>
          !habits.some((habit) => habit.id === existingHabit.id),
      );

      // 생성 처리 대상 구분 : FE로부터 new-로 표시되어온 대상 : 신규입력 대상
      const habitsToCreate = habits.filter((habit) =>
        habit.id.startsWith('new-'),
      );

      //습관수정 대상 - FE로부터 아무 표시가 없는 대상 : name 수정 대상
      const habitsToUpdate = habits.filter(
        (habit) => !habit.id.startsWith('new-'),
      );

      // 삭제/신규/수정 일괄 처리
      await Promise.all([
        // 삭제 처리
        ...habitsToDelete.map((habit) =>
          tx.habit.update({
            where: { id: habit.id },
            data: { isDeleted: true },
          }),
        ),
        // 신규 생성
        ...habitsToCreate.map((habit) =>
          tx.habit.create({
            data: {
              studyId,
              name: habit.name,
            },
          }),
        ),
        // Habit name 수정
        ...habitsToUpdate.map((habit) =>
          tx.habit.update({
            where: { id: habit.id },
            data: { name: habit.name },
          }),
        ),
      ]);
    });
  res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};



