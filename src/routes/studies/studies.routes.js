import express from 'express';
import { habitRouter } from '../habits/index.js';
import { emojiRouter } from '../emojis/index.js';
import { studiesRepository } from '#repository';

export const studiesRouter = express.Router();

// 헬스 체크
studiesRouter.get('/', (req, res) => {
  res.send('/studies 헬스체크 ok');
});

// 계층 연결
studiesRouter.use('/:id/habits', habitRouter);
studiesRouter.use('/:id/emojis', emojiRouter);

// API 작성

// 1. POST /api/studies - 새 스터디 생성
// { 닉네임, 스터디 이름, 스터디에 대한 간단한 소개, 배경 선택, 비밀번호 및 비밀번호 확인 }을
// 입력하여 새 스터디를 생성

// '/' 주소로 post 요청 들어오면,
// (유효성 검사 추가? 미들웨어 처리 필요?), req res를 담은 비동기 함수를 실행한다
studiesRouter.post('/', async (req, res, next) => {
  // 에러를 잡기 위해 try catch문을 사용
  try {
    // 사용자가 보낸 바디에서 { 닉네임, 스터디이름, 스터디소개, 배경, 비밀번호 }를 꺼낸다
    const { nickname, name, description, background, password } = req.body;

    // 만약 보낸 바디에서 { 닉네임, 스터디이름, 스터디소개, 배경, 비밀번호 } 중 하나라도 비어 있다면
    // 400 error를 보내고 함수를 끝낸다.
    if (!nickname || !name || !description || !background || !password) {
      return res
        .status(400) // 상수 설정 시 (HTTP_STATUS.BAD_REQUEST) 수정
        .json({ message: '필수 정보를 모두 입력해주세요.' }); // 상수 설정 시 ({error: ERROR_MESSAGE.??}) 변경
    }

    // 바디에 다 담겨있다면 스터디.레포지토리 를 통해 스터디 테이블에 새로운 데이터를 생성하고, 결과를 담는다
    const newStudy = await studiesRepository.createStudy({
      nickname,
      name,
      description,
      background,
      password,
    });

    // 성공했다는 201번 코드와 방금 만든 스터디 정보를 보내준다
    res
      .status(201) // HTTP 상수 만들어지면 (HTTP_STATUS.CREATED) 수정
      .json(newStudy);
  } catch (error) {
    // catch 위 과정에서 에러가 발생하면 500번 에러내용을 출력한다.
    next(error);
  }
});

// 2. POST /api/studies/verify - 비밀번호 검증
// 모달에서 사용

// 3. PATCH /api/studies/:id - 특정 스터디 수정
// { 비밀번호 }를 입력하여 (스터디 등록 시 입력했던 비밀번호와 일치할 경우), 스터디 정보 수정

// 4. DELETE /api/studies/:id - 특정 스터디 삭제
// { 비밀번호 } 를 입력하여 (스터디 등록 시 입력했던 비밀번호와 일치할 경우), 스터디 삭제
