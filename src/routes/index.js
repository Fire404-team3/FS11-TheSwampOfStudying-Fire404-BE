import express from 'express';
import { userRouter } from './users/index.js';
import { studyRouter } from './studies/index.js';
import { habitRouter } from './habits/index.js';
import { emojiRouter } from './emojis/index.js';

export const router = express.Router();

// 헬스체크
router.get('/', (req, res) => {
  res.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 라우터 연결
router.use('/users', userRouter);
router.use('/studies', studyRouter);    // 추후 계층 구조 연결 후 삭제
router.use('/habits', habitRouter);     // 추후 계층 구조 연결 후 삭제
router.use('/emojis', emojiRouter);     // 추후 계층 구조 연결 후 삭제
