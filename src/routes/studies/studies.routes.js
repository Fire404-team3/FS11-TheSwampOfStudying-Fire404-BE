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
import { prisma } from '#db/prisma.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { NotFoundException, BadRequestException } from '#exceptions';

export const studiesRouter = express.Router();

// GET /studies/:id - 스터디 상세 정보 + Top3 이모지
studiesRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prisma로 스터디 조회 + Top3 이모지
    const study = await prisma.study.findUnique({
      where: { id },
      include: {
        emojiLogs: {
          orderBy: { count: 'desc' },
          take: 3,
        },
      },
    });

    // 표시할 스터디 없으면 404
    if (!study) {
      throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
    }

    // password 제거 & emojiLogs -> top 3Emojis 변환
    const { password, emojiLogs, ...studyData } = study;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        ...studyData,
        top3Emojis: emojiLogs.map(({ emojiType, count }) => ({
          emojiType,
          count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /studies/:id/emojis - 응원 이모지 카운트 증가
studiesRouter.post('/:id/emojis', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { emojiType } = req.body;

    // 이모지 필드가 존재하지 않을 경우 - 프론트엔드 박살
    if (!emojiType || emojiType.trim() === '') {
      throw new BadRequestException(ERROR_MESSAGE.EMOJI_TYPE_REQUIRED);
    }

    // 이모지가 붙을 스터디가 존재하지 확인
    const study = await prisma.study.findUnique({
      where: { id },
    });

    if (!study) {
      throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
    }

    // 같은 이모지가 있으면 +1, 없으면 새로 생성
    const emoji = await prisma.emojiLog.upsert({
      where: {
        studyId_emojiType: {
          studyId: id,
          emojiType: emojiType.trim(),
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        studyId: id,
        emojiType: emojiType.trim(),
        count: 1,
      },
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: emoji,
    });
  } catch (error) {
    next(error);
  }
});

// POST /studies/:id/points - 공부 시간 비례 포인트 적립
studiesRouter.post('/:id/points', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { minutes } = req.body;

    // minutes 필드 검증 (필수, 양수)
    if (minutes === undefined || minutes === null) {
      throw new BadRequestException('Minutes is required');
    }

    if (typeof minutes !== 'number' || minutes <= 0) {
      throw new BadRequestException('Minutes must be greater than 0');
    }

    // 스터디 존재 확인
    const study = await prisma.study.findUnique({
      where: { id },
    });

    if (!study) {
      throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
    }

    // 포인트 계산: 기본 3p + 10분당 1p
    const earnedPoints = 3 + Math.floor(minutes / 10);

    // 스터디 포인트 업데이트
    const updatedStudy = await prisma.study.update({
      where: { id },
      data: {
        points: {
          increment: earnedPoints,
        },
      },
    });

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
});

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
