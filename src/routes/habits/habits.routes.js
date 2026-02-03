import express from 'express';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { habitsRepository } from '#repository';
import { validate } from '#middlewares';
import { habitsSchema } from './habits.schema.js';
import { NotFoundException } from '#exceptions';

export const habitsRouter = express.Router();

//habit 토글 체크 api
//POST /habits/:id/check
//체크하면 habitRecord에 해당 id 에 대한 checkDate 생성
habitsRouter.post(
  '/:id/check',
  validate('params', habitsSchema.paramsIdSchema),
  validate('body', habitsSchema.checkDateSchema.body),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { checkDate } = req.body;

      const newHabitCheckDate = await habitsRepository.toggleHabitCheckDate(
        id,
        checkDate,
      );

      if (!newHabitCheckDate) {
        throw new NotFoundException(
          ERROR_MESSAGE.FAILED_TO_FETCH_HABIT_RECORDS,
        );
      }

      res
        .status(HTTP_STATUS.CREATED)
        .json({ success: true, data: newHabitCheckDate });
    } catch (error) {
      next(error);
    }
  },
);

//체크하면 habitRecord에 해당 id 에 대한 checkDate 삭제
habitsRouter.delete(
  '/:id/check',
  validate('params', habitsSchema.paramsIdSchema),
  validate('body', habitsSchema.checkDateSchema.body),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { checkDate } = req.body;

      await habitsRepository.deleteHabitCheckDate(id, checkDate);

      res.status(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);

// 특정 Study의 습관을 삭제/신규/수정을 동기화 처리하기 위한 로직
// PUT /studies/:studyId
// habitsRouter.put(
//   '/:id', //studyId
//   validateObject(habitsSchema.params, 'params'),
//   validateObject(habitsSchema.body, 'body'),
//   async (req, res, next) => {
//     try {
//       const { id: studyId } = req.params;
//       const habits = req.body;

//       await prisma.$transaction(async (tx) => {
//         //기존 Habit중 현재 isDelted:False 전체습관 조회
//         const existingHabits = await habitsRepository.findActiveByStudyId(
//           tx,
//           studyId,
//         );

//         // 추가: 요청받은 데이터 중 유효한(숫자) Habit Id 목록 추출
//         const incomingIds = habits.map((h) => h.id).filter(Boolean);

//         // Delted 처리할 대상을 선별 - 새로 넘어오지 않은 Habits 추출(isDeleted : true처리 목적)
//         const habitsToDelete = existingHabits.filter(
//           (existingHabit) =>
//             !incomingIds.includes(existingHabit.id),
//         );

//         // 생성 처리 대상 구분 : id가 없는(null) 표시되어온 대상 : 신규입력 대상
//         const habitsToCreate = habits.filter((habit) => !habit.id);

//         //습관수정 대상 - FE로부터 아무 표시가 없는 대상 : name 수정 대상
//         const habitsToUpdate = habits.filter(
//           (habit) => habit.id,
//         );

//         // 삭제/신규/수정 일괄 처리
//         await Promise.all([
//           habitsRepository.deleteHabits(tx, habitsToDelete),
//           habitsRepository.createHabits(tx, studyId, habitsToCreate),
//           habitsRepository.updateHabits(tx, habitsToUpdate),
//         ]);
//       });

//       res.sendStatus(HTTP_STATUS.NO_CONTENT);
//     } catch (error) {
//       next(error);
//     }
//   },
// );
