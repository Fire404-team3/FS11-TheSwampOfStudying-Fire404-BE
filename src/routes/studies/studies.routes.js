import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { prisma } from '#db/prisma.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { HttpException } from '#exceptions';

export const studiesRouter = express.Router();

studiesRouter.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'latest', search } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const take = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * take;

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [studies, totalCount] = await Promise.all([
      prisma.study.findMany({
        where: whereClause,
        orderBy: {
          [sort === 'points' ? 'points' : 'createdAt']: 'desc',
        },
        take,
        skip,
      }),
      prisma.study.count({
        where: whereClause,
      }),
    ]);

    res.status(HTTP_STATUS.OK).json({
      data: studies,
      meta: {
        page: pageNum,
        limit: take,
        totalCount: totalCount,
      },
    });
  } catch (error) {
    // console.error('스터디 조회중 에러 발생', error);
    // res.status(500).json({ message: '서버 에러 발생' });
    const serverError = new HttpException(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGE.FAILED_TO_FETCH_STUDIES,
      error.message,
    );

    next(serverError);
  }
});
// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성
