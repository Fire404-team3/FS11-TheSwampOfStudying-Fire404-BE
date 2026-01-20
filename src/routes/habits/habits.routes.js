import express from 'express';

export const habitsRouter = express.Router();

// 헬스 체크
habitsRouter.get('/', (req, res) => {
  res.send('/habits 헬스체크 ok');
});

// API 만들기