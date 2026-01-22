import { ERROR_MESSAGE } from '#constants';
import z from 'zod';

// 배경 옵션 8개
const STUDY_BACKGROUNDS = [
  'colorGreen',
  'colorYellow',
  'colorBlue',
  'colorPink',
  'imageDesk',
  'imageWindow',
  'imageTile',
  'imagePlant',
];

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
export const updateStudySchema = createStudySchema
  .partial() //선택적으로 수정가능하게
  .extend({
    password: z.string({ required_error: ERROR_MESSAGE.PASSWORD_REQUIRED }), //비밀번호만 필수로
  });

// POST /:id/check-password 비밀번호 검증용 스키마
export const passwordCheckSchema = z.object({
  password: z.string({ required_error: ERROR_MESSAGE.PASSWORD_REQUIRED }),
});
