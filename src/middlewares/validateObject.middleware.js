import { z } from 'zod';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

export const validateObject = (schema, target = 'body') => { // target 추가 (기본값 body)
  return async (req, res, next) => {
    try {
      // 1. 데이터 검증 (req.body 대신 req[target] 사용)
      const validatedData = await schema.parseAsync(req[target]);
      req[target] = validatedData;
      next();
    } catch (error) {   // PR반영은 error-Handler에 위임
      next(error);
    }
  };
};