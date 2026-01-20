import express from 'express';

export const emojisRouter = express.Router();

// 헬스 체크
emojisRouter.get('/', (req, res) => {
  res.send('/emojis 헬스체크 ok');
});

// API 만들기