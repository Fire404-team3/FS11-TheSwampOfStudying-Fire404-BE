import express from 'express';
import { habitsRouter } from './habits.routes.js';
import { habitCheckRouter } from './habit-check.routes.js';

export const habitRouter = express.Router({ mergeParams: true });
habitRouter.use('/', habitsRouter);
habitRouter.use('/',habitCheckRouter)