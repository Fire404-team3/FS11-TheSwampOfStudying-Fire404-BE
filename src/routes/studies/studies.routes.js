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
// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성
