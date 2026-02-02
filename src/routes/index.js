import express from 'express';
import { studyRouter } from './studies/index.js';
import { habitRouter } from './habits/index.js';

export const router = express.Router();

// 헬스체크
router.get('/', (req, res) => {
  res.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 라우터 연결
router.use('/studies', studyRouter);
router.use('/habits', habitRouter);
