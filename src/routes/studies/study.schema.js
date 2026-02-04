import { ERROR_MESSAGE } from '#constants';
import z from 'zod';

// 배경 옵션 8개
export const STUDY_BACKGROUNDS = [
  'colorGreen',
  'colorYellow',
  'colorBlue',
  'colorPink',
  'imageDesk',
  'imageWindow',
  'imageTile',
  'imagePlant',
];
export const findAllSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(['createdAt', 'points']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

// POST 스터디 생성용 스키마
export const createStudySchema = z.object({
  // nickname = String, 필수, 2글자 이상 10글자 이내
  nickname: z
    .string({ required_error: ERROR_MESSAGE.NICKNAME_REQUIRED })
    .trim()
    .min(2, { message: ERROR_MESSAGE.NICKNAME_MIN_LENGTH })
    .max(10, { message: ERROR_MESSAGE.NICKNAME_MAX_LENGTH }),

  // name = String, 필수, 2글자 이상 10글자 이내
  name: z
    .string({ required_error: ERROR_MESSAGE.STUDY_NAME_REQUIRED })
    .trim()
    .min(2, { message: ERROR_MESSAGE.STUDY_NAME_MIN_LENGTH })
    .max(10, { message: ERROR_MESSAGE.STUDY_NAME_MAX_LENGTH }),

  // description = String, 필수, 2글자 이상 50글자 이내
  description: z
    .string({ required_error: ERROR_MESSAGE.DESCRIPTION_REQUIRED })
    .trim()
    .min(2, { message: ERROR_MESSAGE.DESCRIPTION_MIN_LENGTH })
    .max(50, { message: ERROR_MESSAGE.DESCRIPTION_MAX_LENGTH }),

  // background = 8개 중에 1개 선택, 필수
  background: z.enum(STUDY_BACKGROUNDS, {
    required_error: ERROR_MESSAGE.BACKGROUND_REQUIRED,
    invalid_type_error: ERROR_MESSAGE.BACKGROUND_INVALID,
  }),

  // password = String,  필수, 8자리 이상 12자리 이하
  password: z
    .string({ required_error: ERROR_MESSAGE.PASSWORD_REQUIRED })
    .min(8, { message: ERROR_MESSAGE.PASSWORD_MIN_LENGTH })
    .max(12, { message: ERROR_MESSAGE.PASSWORD_MAX_LENGTH }),
});

// PATCH /:id 스터디 수정용 스키마
// extend 시 password 제약조건이 사라지지 않도록 재정의
export const updateStudySchema = createStudySchema
  .partial() //선택적으로 수정가능하게
  .extend({
    password: z
      .string({ required_error: ERROR_MESSAGE.PASSWORD_REQUIRED })
      .min(8, { message: ERROR_MESSAGE.PASSWORD_MIN_LENGTH })
      .max(12, { message: ERROR_MESSAGE.PASSWORD_MAX_LENGTH }),
  });

// 주소창 params 검증용 스키마 -> id가 유효한 형식인지 검증
export const paramsIdSchema = z.object({
  id: z.string().cuid({ message: ERROR_MESSAGE.INVALID_ID_FORMAT }),
});

// POST /:id/check-password 비밀번호 검증용 스키마
export const passwordCheckSchema = z.object({
  password: z.string({ required_error: ERROR_MESSAGE.PASSWORD_REQUIRED }),
});

// POST /:id/emojis 이모지 추가용 스키마
export const emojiSchema = z.object({
  emojiType: z
    .string({ required_error: ERROR_MESSAGE.EMOJI_TYPE_REQUIRED })
    .trim()
    .min(1, { message: ERROR_MESSAGE.EMOJI_TYPE_REQUIRED }),
});

// POST /:id/points 포인트 적립용 스키마
export const pointsSchema = z.object({
  minutes: z
    .number({ required_error: ERROR_MESSAGE.MINUTES_REQUIRED })
    .int({ message: ERROR_MESSAGE.MINUTES_INTEGER })
    .min(30, { message: ERROR_MESSAGE.MINUTES_MIN_VALUE }),
});

// 1. [내부용] 단일 습관 스키마
const habitModalSchema = z.object({
  id: z.string().nullable().optional(), // 리펙토링 -신규 시 'new-' 형태 제거
  // [은결] : id 데이터 타입 number -> string으로 수정
  name: z
    .string({ required_error: ERROR_MESSAGE.HABIT_NAME_REQUIRED })
    .trim()
    .min(2, { message: ERROR_MESSAGE.HABIT_MIN_LENGTH })
    .max(20, { message: ERROR_MESSAGE.HABIT_MAX_LENGTH }),
});

// 2. [Export] 전체 습관 관련 스키마 모음
const habitsModalSchema = {
  // Body 검증용: 습관 배열
  body: z.array(habitModalSchema),

  // Params 검증용: URL의 :id 검증
  params: z.object({
    id: z.string().trim().min(1, { message: '스터디 ID는 필수입니다.' }),
    // 만약 ID가 숫자여야 한다면 아래 주석 해제
    // .regex(/^\d+$/, "ID는 숫자 형식이어야 합니다.")
  }),
};

export const studiesSchema = {
  findAllSchema,
  createStudySchema,
  emojiSchema,
  paramsIdSchema,
  passwordCheckSchema,
  pointsSchema,
  updateStudySchema,
  habitsModalSchema,
};
