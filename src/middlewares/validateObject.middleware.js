import { z } from 'zod';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

export const validateObject = (schema) => {
  return async (req, res, next) => {
    try {
      // 1. 데이터 검증 (parseAsync가 알아서 내부를 순회합니다)
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {   
        const firstIssue = error.issues?.[0]; //Array or Object검증이라 첫번째 에러
        const errorMessage = firstIssue?.message || ERROR_MESSAGE.VALIDATION_FAILED;
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: errorMessage,
        });
      }
      next(error);
    }
  };
};