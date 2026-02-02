import express from 'express';
import { Router } from 'express';
import { prisma } from '#db/prisma.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { habitsRepository } from '#repository';
import { validateObject } from '#middlewares';
import { habitsSchema } from './habits.schema.js';
export const habitsRouter = Router({ mergeParams: true });

// 특정 Study의 습관을 삭제/신규/수정을 동기화 처리하기 위한 로직
habitsRouter.put(
  '/:id',                                   //studyId
  validateObject(habitsSchema.params, 'params'), 
  validateObject(habitsSchema.body, 'body'),
  async (req, res, next) => {
    try {
      const { id: studyId } = req.params;
      const habits = req.body;

      await prisma.$transaction(async (tx) => {
        //기존 Habit중 현재 isDelted:False 전체습관 조회
        const existingHabits = await habitsRepository.findActiveByStudyId(
          tx,
          studyId,
        );

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
          habitsRepository.deleteHabits(tx, habitsToDelete),
          habitsRepository.createHabits(tx, studyId, habitsToCreate),
          habitsRepository.updateHabits(tx, habitsToUpdate),
        ]);
      });

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);


//habit 토글 체크 api
//POST /habits/:id/check
//체크하면 habitRecord에 해당 id 에 대한 checkDate 생성
habitsRouter.post('/:id/check', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkDate } = req.body;

    if (!id) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.HABIT_NOT_FOUND });
    }

    if (!checkDate) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.CHECK_DATE_REQUIRED });
    }

    const newHabitCheckDate = await habitsRepository.toggleHabitCheckDate(
      id,
      checkDate,
    );

    res.status(HTTP_STATUS.CREATED).json(newHabitCheckDate);
  } catch (error) {
    next(error);
  }
});

//체크하면 habitRecord에 해당 id 에 대한 checkDate 삭제
habitsRouter.delete('/:id/check', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkDate } = req.query;

    if (!id) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.HABIT_NOT_FOUND });
    }

    const deleted = await habitsRepository.deleteHabitCheckDate(id, checkDate);

    if (!deleted) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: '해당 날짜 기록 없음' });
    }

    console.log('삭제됨', deleted);
    res.status(HTTP_STATUS.OK).json(deleted);
  } catch (error) {
    next(error);
  }
});
