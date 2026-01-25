import express from 'express';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

import { findstudyWithHabits } from '../../../Repository/studies.repository.js';

//부모 라우터의 id를 자식 라우터에서도 사용가능
export const studyHabitsRouter = express.Router({
  mergeParams: true,
});

// API 작성
//특정 아이디 habit 목록 가져오기
// 포스트맨 검색 -> [ /studies/:id/habits ]
studyHabitsRouter.get('/', async (req, res) => {
  try {
    const { id } = req.params;

    const weekdays = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    const todayName = weekdays[new Date().getDay()];

    const habitList = await findstudyWithHabits(
      id,
      todayName,
    );
    if (!habitList) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.STUDY_NOT_FOUND });
    }
    

    res.status(200).json({
      success: true,
      message: `${id}의 스터디 ${todayName} 습관 목록 조회 성공`,
      data: habitList,
    });
  } catch (error) {
    console.error('GET /studies/:id/habits ERROR >>>', error)
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_HABITS });
  }
});
