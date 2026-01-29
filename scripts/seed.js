import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import { isDevelopment } from '#config';
import { STUDY_BACKGROUNDS } from '../src/routes/studies/study.schema.js';

const DEFAULT_SEED_COUNT = 10;

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

const habitNames = [
  '매일 물 2L 마시기',
  '알고리즘 1문제 풀기',
  '스트레칭 하기',
  '영어 단어 5개 외우기',
  '감사 일기 쓰기',
  '영양제 챙겨먹기',
  '코드 리뷰 1건 하기',
  '독서 20분',
  '스쿼트 30회',
];

const makeStudyInput = () => ({
  nickname: faker.person.lastName() + faker.person.firstName(),
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  background: faker.helpers.arrayElement(STUDY_BACKGROUNDS),
  password: faker.string.numeric({
    length: faker.number.int({ min: 8, max: 12 }),
  }),
  points: faker.number.int({ min: 0, max: 30 }), // 정렬 테스트용
});

const makeHabitInputForStudy = (studyId, count) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return xs(count).map((idx) => {
    const isDeleted = idx === 1; // 첫 번째 습관은 삭제된 상태(Soft Delete) 테스트용
    const isNewToday = idx === count; // 마지막 습관은 오늘 추가된 습관 테스트용

    return {
      name: faker.helpers.arrayElement(habitNames),
      studyId,
      isDeleted,
      // 오늘 추가된 습관이면 createdAt을 오늘로, 아니면 과거로
      createdAt: isNewToday ? new Date() : faker.date.past({ years: 0.1 }),

      records: {
        create: xs(7) // 일~토
          .map((i) => {
            const checkDate = new Date(startOfWeek);
            checkDate.setDate(startOfWeek.getDate() + (i - 1));

            // 요구사항: 오늘 추가된 습관은 이전 날짜 기록표에 표시되지 않아야 함
            if (isNewToday && checkDate < new Date().setHours(0, 0, 0, 0))
              return null;

            // 60% 확률로 완료 기록 생성
            return faker.datatype.boolean(0.6) ? { checkDate } : null;
          })
          .filter(Boolean),
      },
    };
  });
};

const makeEmojiLogInput = () => {
  const emojiPool = [
    '🔥',
    '👍',
    '🙌',
    '🎉',
    '💪',
    '✨',
    '🚀',
    '💯',
    '🤩',
    '👏',
    '💖',
    '💡',
    '✅',
    '⭐',
    '🎈',
    '🏆',
    '🍀',
    '🎯',
    '🌈',
    '⚡',
    '🥳',
    '😎',
    '🌻',
    '🤝',
  ];

  // 각 스터디마다 8~12개의 이모지를 랜덤하게 선택 (중복 없음)
  const selectedEmojis = faker.helpers.arrayElements(emojiPool, {
    min: 8,
    max: 12,
  });

  return selectedEmojis.map((emoji) => ({
    emojiType: emoji,
    count: faker.number.int({ min: 1, max: 50 }), // 상위 3개 선별을 위해 넉넉한 범위
  }));
};

const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.habitRecord.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.emojiLog.deleteMany(),
    prisma.study.deleteMany(),
  ]);

const seedStudies = async (prisma, count) => {
  for (const _ of xs(count)) {
    // 1. 스터디를 생성하면서 해당 스터디에 종속된 EmojiLog들을 한 번에 생성
    const study = await prisma.study.create({
      data: {
        ...makeStudyInput(),
        emojiLogs: {
          create: makeEmojiLogInput(), // 여기서 생성된 이모지들은 이 study.id에 종속됨
        },
      },
    });

    // 2. 해당 스터디에 종속된 습관들 생성 (HabitRecord 포함)
    const habitCount = faker.number.int({ min: 0, max: 6 });
    const habits = makeHabitInputForStudy(study.id, habitCount);
    for (const habitData of habits) {
      await prisma.habit.create({
        data: habitData,
      });
    }
  }
};

async function main(prisma) {
  if (!isDevelopment) {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  console.log('🌱 시딩 시작...');

  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  await seedStudies(prisma, DEFAULT_SEED_COUNT);
  console.log('✅ 데이터 시딩 완료');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
