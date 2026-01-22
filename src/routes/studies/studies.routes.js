import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { studiesRepository } from '../../Repository/studies.repository.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

export const studiesRouter = express.Router();

// // 헬스 체크
// studiesRouter.get('/', (req, res) => {
//   res.send('/studies 헬스체크 ok');
// });

// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성


//특정 아이디 habit 목록 가져오기
// 포스트맨 검색 -> [ /habits/studyId ]
studiesRouter.get('/:id/habits', async (req, res) => {
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
    const todayIndex = weekdays[new Date().getDay()];
    
    if (!id) {
      return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({error: ERROR_MESSAGE.STUDY_NOT_FOUND})
    }
    
    const habitList = await studiesRepository.findHabitsByStudyId(id,todayIndex);
    res.status(200).json({
      success: true,
      message: `${id}의 스터디 ${todayIndex} 습관 목록 조회 성공`,
      data: habitList,
    });
  } catch (_) {
    res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({error:ERROR_MESSAGE.FAILED_TO_FETCH_HABITS})
  }
});
