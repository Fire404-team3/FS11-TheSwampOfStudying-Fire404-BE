import express from 'express';
import { emojisRouter } from './emojis.routes.js';

export const emojiRouter = express.Router({ mergeParams: true });
emojiRouter.use('/', emojisRouter);
