import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { prisma } from '#db/prisma.js';

export const studiesRouter = express.Router();

studiesRouter.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'latest', search } = req.query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const studies = await prisma.study.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: {
        [sort === 'points' ? 'points' : 'createdAt']: 'desc',
      },
      take,
      skip,
    });

    res.status(200).json(studies);
  } catch (error) {
    console.error('스터디 조회중 에러 발생', error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

// 임시 테스트 코드
studiesRouter.post('/', async (req, res) => {
  try {
    const newStudy = await prisma.study.create({
      data: {
        name: '두 번째 테스트 스터디', // 이름을 살짝 바꿔주면 구분하기 좋아요
        description: '비밀번호까지 넣고 성공할 데이터!',
        nickname: '테스터2',
        points: 300, // 정렬 확인을 위해 점수를 아까와 다르게 설정해 보세요
        background: 'blue-theme',
        password: 'password123', // 이 부분을 추가했습니다!
      },
    });
    res.status(201).json(newStudy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성
