// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};

// 에러 메세지 상수
export const ERROR_MESSAGE = {
  // Study 관련
  STUDY_NOT_FOUND: '스터디를 찾을 수 없습니다.',
  FAILED_TO_FETCH_STUDIES: 'Failed to fetch studies',
  FAILED_TO_FETCH_STUDY: 'Failed to fetch study',
  FAILED_TO_CREATE_STUDY: 'Failed to create study',
  FAILED_TO_UPDATE_STUDY: 'Failed to update study',
  FAILED_TO_DELETE_STUDY: 'Failed to delete study',

  // 유효성 검사
  NICKNAME_REQUIRED: '닉네임은 필수입니다.',
  NICKNAME_MIN_LENGTH: '닉네임은 2글자 이상이어야 합니다.',
  NICKNAME_MAX_LENGTH: '닉네임은 10글자 이내여야 합니다.',

  STUDY_NAME_REQUIRED: '스터디 이름은 필수입니다.',
  STUDY_NAME_MIN_LENGTH: '스터디 이름은 2글자 이상이어야 합니다.',
  STUDY_NAME_MAX_LENGTH: '스터디 이름은 10글자 이내여야 합니다.',

  DESCRIPTION_REQUIRED: '소개글은 필수입니다.',
  DESCRIPTION_MIN_LENGTH: '소개글은 2글자 이상이어야 합니다.',
  DESCRIPTION_MAX_LENGTH: '소개글은 50글자 이내여야 합니다.',

  BACKGROUND_REQUIRED: '배경 색상을 반드시 선택해주세요.',
  BACKGROUND_INVALID: '지원하지 않는 배경입니다.',

  PASSWORD_REQUIRED: '비밀번호는 필수입니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  PASSWORD_MIN_LENGTH: '비밀번호는 8자리 이상이어야 합니다.',
  PASSWORD_MAX_LENGTH: '비밀번호는 12자리 이내여야 합니다.',

  INVALID_ID_FORMAT: '유효하지 않은 아이디 형식입니다.',

  // Habit 관련
  HABIT_NOT_FOUND: '습관을 찾을 수 없습니다.',
  HABIT_NAME_REQUIRED: '습관 이름은 필수입니다.',

  HABIT_MIN_LENGTH: '습관 등록은 2자리 이상이어야 합니다.',
  HABIT_MAX_LENGTH: '습관 등록은 20자리 이내이어야 합니다.',

  FAILED_TO_FETCH_HABITS: 'Failed to fetch habits',
  FAILED_TO_FETCH_HABIT: 'Failed to fetch habit',
  FAILED_TO_CREATE_HABIT: 'Failed to create habit',
  FAILED_TO_UPDATE_HABIT: 'Failed to update habit',
  FAILED_TO_DELETE_HABIT: 'Failed to delete habit',

  // HabitRecord 관련
  HABIT_ID_REQUIRED: '습관 ID는 필수입니다.',
  CHECK_DATE_REQUIRED: '습관 날짜는 필수 입니다.',
  FAILED_TO_FETCH_HABIT_RECORDS: '습관기록들을 가져오는데 실패했습니다.',
  
  FAILED_TO_FETCH_HABIT_RECORD: 'Failed to fetch habit record',
  FAILED_TO_CREATE_HABIT_RECORD: 'Failed to create habit record',
  FAILED_TO_UPDATE_HABIT_RECORD: 'Failed to update habit record',
  FAILED_TO_DELETE_HABIT_RECORD: 'Failed to delete habit record',

  // Points 관련
  MINUTES_REQUIRED: '집중 시간을 설정해 주세요.',
  MINUTES_INTEGER: '집중 시간은 분 단위로 설정해 주세요.',
  MINUTES_MIN_VALUE: '집중하는 시간은 최소 10분 이상이어야 합니다.',

  // Emoji 관련
  EMOJI_NOT_FOUND: '이모지를 찾을 수 없습니다.',
  EMOJI_TYPE_REQUIRED: '이모지를 생성해 주세요.',

  // common 에러
  STUDY_ID_REQUIRED: '스터디를 생성해 주세요.',

  // 일반 에러 (Exception 기본값으로 사용)
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  RESOURCE_NOT_FOUND: 'Resource not found',
  RESOURCE_CONFLICT: 'Resource conflict',
  INTERNAL_SERVER_ERROR: 'Internal server error',

  // Validation
  INVALID_INPUT: '유효하지 않은 입력입니다.',
  VALIDATION_FAILED: '유효성 검사에 실패했습니다.',
};
