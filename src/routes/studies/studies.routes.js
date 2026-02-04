import express from 'express';
import { prisma } from '#db/prisma.js';
import { habitsRepository, studiesRepository } from '#repository';
import { studiesSchema } from './study.schema.js';
import { checkStudyOwner, validate, validateObject } from '#middlewares';
import { NotFoundException } from '#exceptions';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { endOfDay, startOfWeek } from 'date-fns';

export const studiesRouter = express.Router();

// GET /studies
studiesRouter.get(
  '/',
  validate('query', studiesSchema.findAllSchema),
  async (req, res, next) => {
    try {
      const { page, limit, sort, order, search } = req.query;

      const { studies, totalCount } = await studiesRepository.findAndCountAll({
        page,
        limit,
        sort,
        order,
        search,
      });

      res.status(HTTP_STATUS.OK).json({
        data: studies,
        meta: {
          page: page,
          limit: limit,
          totalCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// --------- 1. POST /api/studies - 새 스터디 생성 -----------
// 미들웨어와 스터디 스키마를 통해 req.body 코드 간소화

studiesRouter.post(
  '/',
  validate('body', studiesSchema.createStudySchema),
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
  validate('params', studiesSchema.paramsIdSchema),
  validate('body', studiesSchema.passwordCheckSchema),
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
  validate('params', studiesSchema.paramsIdSchema),
  validate('body', studiesSchema.updateStudySchema),
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
  validate('params', studiesSchema.paramsIdSchema),
  validate('body', studiesSchema.passwordCheckSchema),
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

// 상세페이지 전용 + 이모지 카운트 순 정렬 로직
// GET /studies/:id - 스터디 상세 정보 (습관, 기록, 정렬된 이모지 포함)
studiesRouter.get(
  '/:id',
  validate('params', studiesSchema.paramsIdSchema), // 유효성 검사 미들웨어
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfDay(new Date(), { weekStartsOn: 1 });

      // 통합된 레포지토리 메서드 호출 (habits, records, sorted emojiLogs 포함)
      const study = await studiesRepository.fetchAllResources(
        id,
        weekStart,
        weekEnd,
      );

      // 3. 존재 여부 확인 및 예외 처리
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      // password 제거 및 데이터 구조화 필요할 경우
      // const { _password, ...studyData } = study;

      // 데이터 가공 없이 전체 정보 반환 (비밀번호 포함)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `${id}번 스터디의 전체 정보 조회 성공`,
        data: study,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /studies/:id/emojis - 응원 이모지 카운트 증가
studiesRouter.post(
  '/:id/emojis',
  validate('params', studiesSchema.paramsIdSchema),
  validate('body', studiesSchema.emojiSchema),
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

// PATCH /studies/:id/emojis - 응원 이모지 카운트 감소
studiesRouter.patch(
  '/:id/emojis',
  validate('params', studiesSchema.paramsIdSchema),
  validate('body', studiesSchema.emojiSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { emojiType } = req.body;

      const study = await studiesRepository.findStudyById(id);

      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      const emoji = await studiesRepository.findEmojibyStudyId(id, emojiType);

      if (!emoji) {
        throw new NotFoundException(ERROR_MESSAGE.EMOJI_NOT_FOUND);
      }
      if (emoji.count <= 1) {
        await studiesRepository.deleteEmoji(id, emojiType);

        return res.status(HTTP_STATUS.OK).json({
          success: true,
          message: `${emojiType}이(가) 제거됨`,
        });
      }

      const updatedEmoji = await studiesRepository.decreaseEmoji(id, emojiType);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: updatedEmoji,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /studies/:id/points - 공부 시간 비례 포인트 적립
studiesRouter.post(
  '/:id/points',
  validate('params', studiesSchema.paramsIdSchema),
  validate('body', studiesSchema.pointsSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { minutes, isSuccess } = req.body;

      const study = await studiesRepository.findStudyById(id);

      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      // 포인트 계산: 성공 시 기본 3p + 10분당 1p, 실패 시 10분당 1p만
      const SUCCESS_POINTS = 3;
      const earnedPoints =
        (isSuccess ? SUCCESS_POINTS : 0) + Math.floor(minutes / 10);

      const updatedStudy = await studiesRepository.addPoints(id, earnedPoints);

      res.status(HTTP_STATUS.OK).json({
        studyId: updatedStudy.id,
        earnedPoints,
        totalPoints: updatedStudy.points,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 오늘의 습관
// GET /studies/:id/habits
studiesRouter.get(
  '/:id/habits',
  validate('params', studiesSchema.paramsIdSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const habitList = await studiesRepository.findStudyWithHabits(id);

      if (!habitList) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `${id}의 스터디 습관 목록 조회 성공`,
        data: habitList,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 특정 Study의 습관을 삭제/신규/수정을 동기화 처리하기 위한 로직
// PUT /studies/:studyId
studiesRouter.put(
  '/:id/habits', //studyId
  validateObject(studiesSchema.habitsModalSchema.params, 'params'),
  validateObject(studiesSchema.habitsModalSchema.body, 'body'),
  async (req, res, next) => {
    try {
      const { id: studyId } = req.params;
      const habits = req.body;

      await prisma.$transaction(async (tx) => {
        //기존 Habit중 현재 isDelted:False 전체습관 조회
        const existingHabits = await habitsRepository.findActiveByStudyId(
          tx,
          studyId,
        );

        // 추가: 요청받은 데이터 중 유효한(숫자) Habit Id 목록 추출
        const incomingIds = habits.map((h) => h.id).filter(Boolean);

        // Delted 처리할 대상을 선별 - 새로 넘어오지 않은 Habits 추출(isDeleted : true처리 목적)
        const habitsToDelete = existingHabits.filter(
          (existingHabit) => !incomingIds.includes(existingHabit.id),
        );

        // 생성 처리 대상 구분 : id가 없는(null) 표시되어온 대상 : 신규입력 대상
        const habitsToCreate = habits.filter((habit) => !habit.id);

        //습관수정 대상 - FE로부터 아무 표시가 없는 대상 : name 수정 대상
        const habitsToUpdate = habits.filter((habit) => habit.id);

        // 삭제/신규/수정 일괄 처리
        await Promise.all([
          habitsRepository.deleteHabits(tx, habitsToDelete),
          habitsRepository.createHabits(tx, studyId, habitsToCreate),
          habitsRepository.updateHabits(tx, habitsToUpdate),
        ]);
      });

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);
