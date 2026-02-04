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

      const habit = await habitsRepository.findHabitById(id);

      if (!habit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      const newHabitCheckDate = await habitsRepository.toggleHabitCheckDate(
        id,
        checkDate,
      );

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

      const habit = await habitsRepository.findHabitById(id);

      if (!habit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      await habitsRepository.deleteHabitCheckDate(id, checkDate);

      res.status(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
