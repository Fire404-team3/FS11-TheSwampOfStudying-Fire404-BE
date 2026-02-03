// src/schemas/habits.schema.js
import z from 'zod';
import { ERROR_MESSAGE } from '#constants';

// 1. [내부용] 단일 습관 스키마
const habitSchema = z.object({
  id: z.string().nullable().optional(), // 리펙토링 -신규 시 'new-' 형태 제거
  // [은결] : id 데이터 타입 number -> string으로 수정
  name: z
    .string({ required_error: ERROR_MESSAGE.HABIT_NAME_REQUIRED })
    .trim()
    .min(2, { message: ERROR_MESSAGE.HABIT_MIN_LENGTH })
    .max(20, { message: ERROR_MESSAGE.HABIT_MAX_LENGTH }),
});

// 2. [Export] 전체 습관 관련 스키마 모음
export const habitsSchema = {
  // Body 검증용: 습관 배열
  body: z.array(habitSchema),

  // Params 검증용: URL의 :id 검증
  params: z.object({
    id: z
      .string()
      .trim()
      .min(1, { message: "스터디 ID는 필수입니다." })
      // 만약 ID가 숫자여야 한다면 아래 주석 해제
      // .regex(/^\d+$/, "ID는 숫자 형식이어야 합니다.") 
  }),
};