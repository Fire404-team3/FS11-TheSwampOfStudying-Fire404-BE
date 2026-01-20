import express from 'express';
import { studyRouter } from '../studies/index.js';

export const usersRouter = express.Router();

// 헬스 체크
usersRouter.get('/', (req, res) => {
  res.send('/users 헬스체크 ok');
});

// 계층 연결
usersRouter.use('/:id/studies', studyRouter);

// API 만들기
