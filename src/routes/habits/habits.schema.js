// src/schemas/habits.schema.js
import z from 'zod';
import { ERROR_MESSAGE } from '#constants';

// habit 하나 단위 schema
const habitSchema = z.object({
  id: z.string().optional(), // 수정용, 신규 생성이면 없음
  name: z
    .string({ required_error: ERROR_MESSAGE.HABIT_NAME_REQUIRED })
    .trim()
    .min(2, { message: ERROR_MESSAGE.HABIT_MIN_LENGTH })
    .max(20, { message: ERROR_MESSAGE.HABIT_MAX_LENGTH }),
});

// habit 배열 schema
export const habitsSchema = z.array(habitSchema);