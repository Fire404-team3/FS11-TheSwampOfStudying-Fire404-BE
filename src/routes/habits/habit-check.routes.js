import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import express from 'express';
import { habitsRepository } from '#repository';

export const habitCheckRouter = express.Router();

//habit 토글 체크 api
//POST /habits/:id/check
//체크하면 habitRecord에 해당 id 에 대한 checkDate 생성

habitCheckRouter.post('/:id/check', async (req, res, next) => {
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