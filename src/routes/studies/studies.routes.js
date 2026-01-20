import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';

export const studiesRouter = express.Router();

// 헬스 체크
studiesRouter.get('/', (req, res) => {
  res.send('/studies 헬스체크 ok');
});

// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성

