import express from 'express';
import { habitsRouter } from './habits.routes.js';

export const habitRouter = express.Router();
habitRouter.use('/', habitsRouter);
