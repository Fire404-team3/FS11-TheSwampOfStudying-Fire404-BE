import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { studiesRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { checkStudyOwner, validate } from '#middlewares';
import { NotFoundException } from '#exceptions';
import {
  createStudySchema,
  emojiSchema,
  paramsIdSchema,
  passwordCheckSchema,
  pointsSchema,
  updateStudySchema,
} from './study.schema.js';

export const studiesRouter = express.Router();

// GET /studies/:id - 스터디 상세 정보 + Top3 이모지
studiesRouter.get(
  '/:id',
  validate('params', paramsIdSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const study = await studiesRepository.findStudyWithTopEmojis(id);

      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      // password 제거 & emojiLogs -> topRankedEmojis 변환
      const { _password, emojiLogs, ...studyData } = study;

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          ...studyData,
          topRankedEmojis: emojiLogs.map(({ emojiType, count }) => ({
            emojiType,
            count,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /studies/:id/emojis - 응원 이모지 카운트 증가
studiesRouter.post(
  '/:id/emojis',
  validate('params', paramsIdSchema),
  validate('body', emojiSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { emojiType } = req.body;

      const study = await studiesRepository.findStudyById(id);

      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      const emoji = await studiesRepository.upsertEmoji(id, emojiType);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: emoji,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /studies/:id/points - 공부 시간 비례 포인트 적립
studiesRouter.post(
  '/:id/points',
  validate('params', paramsIdSchema),
  validate('body', pointsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { minutes } = req.body;

      const study = await studiesRepository.findStudyById(id);

      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      // 포인트 계산: 기본 3p + 10분당 1p
      const earnedPoints = 3 + Math.floor(minutes / 10);

      const updatedStudy = await studiesRepository.addPoints(id, earnedPoints);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          studyId: updatedStudy.id,
          earnedPoints,
          totalPoints: updatedStudy.points,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);

// --------- 1. POST /api/studies - 새 스터디 생성 -----------
// 미들웨어와 스터디 스키마를 통해 req.body 코드 간소화

studiesRouter.post(
  '/',
  validate('body', createStudySchema),
  async (req, res, next) => {
    try {
      const newStudy = await studiesRepository.createStudy(req.body);

      res.status(HTTP_STATUS.CREATED).json(newStudy);
    } catch (error) {
      next(error);
    }
  },
);

// --------- 2. POST /api/studies/:id/check-password - 비밀번호 검증 ------------
// 3,4를 위한 권한 확인용, 모달(비밀번호 인증) 성공 시 3(수정), 4(삭제)를 할 수 있도록 사용
// checkStudyOwner 미들웨어를 사용하여 중복코드 간소화

studiesRouter.post(
  '/:id/check-password',
  validate('params', paramsIdSchema),
  validate('body', passwordCheckSchema),
  checkStudyOwner,
  async (req, res, next) => {
    try {
      // checkStudyOwner를 통과하면(스터디 정보가 있고 비밀번호 일치) 200
      res.sendStatus(HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  },
);

// --------- 3. PATCH /api/studies/:id - 특정 스터디 수정 -----------
// { 비밀번호 }를 입력하여 (스터디 등록 시 입력했던 비밀번호와 일치할 경우), 스터디 정보 수정
// checkStudyOwner 미들웨어를 사용하여 중복코드 간소화

studiesRouter.patch(
  '/:id',
  validate('params', paramsIdSchema),
  validate('body', updateStudySchema),
  checkStudyOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedStudy = await studiesRepository.updateStudy(id, req.body);

      res.status(HTTP_STATUS.OK).json(updatedStudy);
    } catch (error) {
      next(error);
    }
  },
);

// 4. DELETE /api/studies/:id - 특정 스터디 삭제
// checkStudyOwner 미들웨어를 사용하여 중복코드 간소화

studiesRouter.delete(
  '/:id',
  validate('params', paramsIdSchema),
  validate('body', passwordCheckSchema),
  checkStudyOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      await studiesRepository.deleteStudy(id);

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
