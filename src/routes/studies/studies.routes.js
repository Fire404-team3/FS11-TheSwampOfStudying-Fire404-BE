import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { studyHabitsRouter } from './habits/study-habits.routes.js';

export const studiesRouter = express.Router();

// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);
studiesRouter.use('/:id/habits', studyHabitsRouter);
