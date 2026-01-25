// 테스트용 test router가 포함되어 있습니다.(HabitModaltest)
// 아래 comment된 2줄 merge시에 제거 필요

import { Router } from 'express';
import { testRouter } from './test.routes.js'; // modal test: 제거대상 
import { habitRouter } from './habits.routes.js';

const router = Router();

router.use('/', habitRouter);
router.use('/habitmodaltest', testRouter); // modal test: 제거대상 

export { router as habitRouter }


//---------------------------------------------
// 클론시 있었던 내용
// import express from 'express';
// import { habitsRouter } from './habits.routes.js';
