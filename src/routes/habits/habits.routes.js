//Merge시 Habit Modal 통합 테스트를 위한 임시코드 삭제가 필요합니다.
import { Router } from 'express';
import { syncHabitsByStudy } from '#repository';
// export const habitRouter = express.Router();

export const habitRouter = Router();
habitRouter.put('/:studyId', syncHabitsByStudy);

//----------------------------------
// 클론시 있었던 내용
// import express from 'express';

// export const habitsRouter = express.Router();

// // 헬스 체크
// habitsRouter.get('/', (req, res) => {
//   res.send('/habits 헬스체크 ok');
// });

// // API 만들기
//----------------------------------