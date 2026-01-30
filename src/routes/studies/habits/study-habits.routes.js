import express from 'express';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { studiesRepository } from '#repository';

//부모 라우터의 id를 자식 라우터에서도 사용가능
export const studyHabitsRouter = express.Router({
  mergeParams: true,
});

// API 작성
//특정 아이디 habit 목록 가져오기
// 포스트맨 검색 -> [ /studies/:id/habits ]
studyHabitsRouter.get('/', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_STUDY });
    }

    const habitList = await studiesRepository.findStudyWithHabits(id);
    if (!habitList) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.STUDY_NOT_FOUND });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${id}의 스터디 습관 목록 조회 성공`,
      data: habitList,
    });
  } catch (error) {
    next(error);
  }
});

//상세페이지
// 포스트맨 검색 -> [ /studies/:id/habits/resources ]
studyHabitsRouter.get('/resources', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_STUDY });
    }

    const studyAllResources = await studiesRepository.fetchAllResources(id);
    if (!studyAllResources) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.STUDY_NOT_FOUND });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${id}의 전체 정보 조회 성공`,
      data: studyAllResources,
    });
  } catch (error) {
    next(error);
  }
});
