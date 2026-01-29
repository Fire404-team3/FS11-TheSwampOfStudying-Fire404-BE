import { z } from 'zod';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

export const validateObject = (schema, target = 'body') => { // target 추가 (기본값 body)
  return async (req, res, next) => {
    try {
      // 1. 데이터 검증 (req.body 대신 req[target] 사용)
      const validatedData = await schema.parseAsync(req[target]);
      req[target] = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {   
        const firstIssue = error.issues?.[0];
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