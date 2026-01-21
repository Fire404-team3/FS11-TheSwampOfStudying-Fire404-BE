// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};

// 에러 메세지 상수
export const ERROR_MESSAGE = {
  // Study 관련
  STUDY_NOT_FOUND: 'Study not found',
  NICKNAME_REQUIRED: 'Nickname is required',
  STUDY_NAME_REQUIRED: 'Study name is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  PASSWORD_REQUIRED: 'Password is required',
  FAILED_TO_FETCH_STUDIES: 'Failed to fetch studies',
  FAILED_TO_FETCH_STUDY: 'Failed to fetch study',
  FAILED_TO_CREATE_STUDY: 'Failed to create study',
  FAILED_TO_UPDATE_STUDY: 'Failed to update study',
  FAILED_TO_DELETE_STUDY: 'Failed to delete study',

  // Habit 관련
  HABIT_NOT_FOUND: 'Habit not found',
  HABIT_NAME_REQUIRED: 'Habit name is required',
  FAILED_TO_FETCH_HABITS: 'Failed to fetch habits',
  FAILED_TO_FETCH_HABIT: 'Failed to fetch habit',
  FAILED_TO_CREATE_HABIT: 'Failed to create habit',
  FAILED_TO_UPDATE_HABIT: 'Failed to update habit',
  FAILED_TO_DELETE_HABIT: 'Failed to delete habit',

  // HabitRecord 관련
  HABIT_ID_REQUIRED: 'Habit id is required',
  CHECK_DATE_REQUIRED: 'Check Date is Required',
  FAILED_TO_FETCH_HABIT_RECORDS: 'Failed to fetch habit records',
  FAILED_TO_FETCH_HABIT_RECORD: 'Failed to fetch habit record',
  FAILED_TO_CREATE_HABIT_RECORD: 'Failed to create habit record',
  FAILED_TO_UPDATE_HABIT_RECORD: 'Failed to update habit record',
  FAILED_TO_DELETE_HABIT_RECORD: 'Failed to delete habit record',

  // Emoji 관련
  EMOJI_TYPE_REQUIRED: 'Emoji type is required',
  EMOJI_TYPE_ALREADY_EXISTS: 'Emoji type already exists in this study',
  FAILED_TO_FETCH_EMOJIS: 'Failed to fetch Emojis',
  FAILED_TO_FETCH_EMOJI: 'Failed to fetch Emoji',
  FAILED_TO_CREATE_EMOJI: 'Failed to create Emoji',
  FAILED_TO_UPDATE_EMOJI: 'Failed to update Emoji',
  FAILED_TO_DELETE_EMOJI: 'Failed to delete Emoji',

  // common 에러
  STUDY_ID_REQUIRED: 'Study id is required',

  // 일반 에러 (Exception 기본값으로 사용)
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_CONFLICT: 'Resource conflict',
  INTERNAL_SERVER_ERROR: 'Internal server error',

  // Validation 추후 key 값 추가
  INVALID_INPUT: '',
  VALIDATION_FAILED: '',

  // Auth 관련 추후 key 값 추가
  NO_AUTH_TOKEN: '',
  INVALID_TOKEN: '',
  STUDY_NOT_FOUND_FROM_TOKEN: '',
  AUTH_FAILED: '',
  INVALID_CREDENTIALS: '',
};
