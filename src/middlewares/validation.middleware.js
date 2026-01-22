// 'middlewares/validation.middleware.js'
// 스터디 검증 미들웨어

import { isProduction } from '#config';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { flattenError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  // safeParse를 사용하여 에러 직접 제어
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Zod 에러를 flatten하여 필드별로 정리
    const { fieldErrors, formErrors } = flattenError(result.error);

    // 프로덕션 환경: 상세 규칙/메세지 숨기고, 어떤 필드가 문제인지 제공
    if (isProduction) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.INVALID_INPUT,
        invalidFields: Object.keys(fieldErrors),
        formErrors,
      });
    }

    // 개발환경: 필드별 상세 에러메세지 반환(디버깅)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGE.VALIDATION_FAILED,
      details: fieldErrors,
      formErrors,
    });
  }

  // 검증된 데이터를 요청한 바디에 재할당
  req.body = result.data;

  next();
};
