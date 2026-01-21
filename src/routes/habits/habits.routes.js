import express from 'express';
import { habitRepository } from '../../Repository/habit.repository.js';
import { success } from 'zod';

export const habitsRouter = express.Router();

// // 헬스 체크
// habitsRouter.get('/', (req, res) => {
//   res.send('/habits 헬스체크 ok');
// });

// API 만들기


//studyid와 상관없이 다 가져오기
habitsRouter.get('/', async (req, res) => {
  try {
    const habits = await habitRepository.findAllHabit();
    res.json(habits)
  } catch (error) {
      console.error('❌',error)  
  }
})


//특정 아이디 habit 목록 가져오기 
// 포스트맨 검색 -> [ /habits/studyId ]
habitsRouter.get('/:studyId', async (req, res) => {
  try {
    const { studyId } = req.params;

    if (isNaN(studyId)) {
      return res.status(400).json({ success: false, message: '다시해라'})
    }

    const habitList = await habitRepository.findHabitsByStudyId(studyId);
    res.status(200).json({
      success: true,
      message: `${studyId}의 스터디 습관 목록 조회 성공`,
      data: habitList

    })
  } catch (error) {
    console.error('❌',error)
  }
})

//오늘 날짜 기준 유효한 목록 조회
habitsRouter.get('/:studyId/today', async (req,res) => {
  try {
    const { studyId } = req.params;
    const weekdays = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']
    const today = weekdays[new Date().getDay()];

    if (isNaN(studyId)) {
      return res.status(404).json({message: '다시해라...바보야.ㅏ.'})
    }
    const todayHabits = await habitRepository.findTodayHabitsByStudyId(studyId, today);
    res.status(200).json({
      success: true,
      message: `${studyId}의 ${today} 습관 목록 조회 성공`,
      
      data: todayHabits
    })
  } catch (error) {
    console.error('❌',error)
  }
})

//습관 체크 토글???
habitsRouter.post('/id/check', async (req, res) => {
  try {
    const habitId = req.params;
    
  } catch (error) {
    
  }
})

