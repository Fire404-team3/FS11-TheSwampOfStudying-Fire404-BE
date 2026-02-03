import express from 'express';
import { studiesRouter } from './studies.routes.js';

export const studyRouter = express.Router();

studyRouter.use('/', studiesRouter);
