import { ERROR_MESSAGE } from '#constants';
import z from 'zod';

// 주소창 params 검증용 스키마 -> id가 유효한 형식인지 검증
export const paramsIdSchema = z.object({
  id: z.string().cuid({ message: ERROR_MESSAGE.INVALID_ID_FORMAT }),
});

//post habits/:id/check => checkDate 확인용
export const checkDateSchema = {
  body: z.object({
    checkDate: z.coerce.date({ message: ERROR_MESSAGE.FAILED_TO_FETCH_HABIT_RECORDS})
  })
}


export const habitsSchema = {
  paramsIdSchema,
  checkDateSchema,
};
