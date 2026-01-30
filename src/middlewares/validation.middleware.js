import { isProduction } from '#config';
import { ERROR_MESSAGE } from '#constants';
import { BadRequestException } from '#exceptions';
import { flattenError } from 'zod';

// 범용 데이터 검증 미들웨어
// 코드 리뷰 반영 사항
// 1. res.json 대신 throw new BadRequestException 로 처리
// 2. fieldErrors 처리
// 3. body + params, query 검증 추가
// 4. Object.assign으로 읽기 전용 속정 문제 해결

export const validate = (target, schema) => {
  // 타켓(body, query, params)이 유효한지 먼저 체크
  if (!['body', 'query', 'params'].includes(target)) {
    throw new Error(
      `[validate middleware] Invalid target: "${target}". Expected "body", "query", or "params".`,
    );
  };

  return (req, res, next) => {
    try {
      // 지정된 타겟 검증
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        const { fieldErrors } = flattenError(result.error);

        // 프로덕션 환경에서는 fieldErrors(Zod 전용 에러 메세지) 숨김
        if (isProduction) {
          throw new BadRequestException(ERROR_MESSAGE.INVALID_INPUT);
        }

        // 개발환경이면 어떤 필드가 틀렸는지 fieldErrors 함께 출력
        throw new BadRequestException(
          ERROR_MESSAGE.VALIDATION_FAILED,
          fieldErrors,
        );
      }
      // 검증된 데이터를 기존 데이터에 재할당, 읽기전용을 대비해 Object.assign 사용
      Object.assign(req[target], result.data);

      next();
    } catch (error) {
      next(error);
    }
  };
};
