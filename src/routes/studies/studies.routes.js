import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { studiesRepository } from '#repository';
import { HTTP_STATUS } from '#constants';
import { checkStudyOwner, validate } from '#middlewares';
import {
  createStudySchema,
  paramsIdSchema,
  passwordCheckSchema,
  updateStudySchema,
} from './study.schema.js';

export const studiesRouter = express.Router();

// 헬스 체크
studiesRouter.get('/', (req, res) => {
  res.send('/studies 헬스체크 ok');
});

// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성

// [추가] --------- 0. GET /api/studies/:id - 특정 스터디 상세 조회 -----------
// 프론트엔드 상세페이지에서 데이터를 불러오기 위해 반드시 필요합니다.
studiesRouter.get(
  '/:id',
  validate('params', paramsIdSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      // 레포지토리에서 ID로 스터디 조회
      const study = await studiesRepository.findStudyById(id);

      if (!study) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: '스터디를 찾을 수 없습니다.' });
      }

      res.status(HTTP_STATUS.OK).json(study);
    } catch (error) {
      next(error);
    }
  },
);

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
