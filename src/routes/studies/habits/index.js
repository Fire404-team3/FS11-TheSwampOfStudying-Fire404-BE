import express from 'express';
import { studyHabitsRouter as router } from './study-habits-routes.js';

//부모 라우터의 id를 자식 라우터에서도 사용가능
export const studyHabitsRouter = express.Router({
  mergeParams: true,
});

studyHabitsRouter.use('/', router);
