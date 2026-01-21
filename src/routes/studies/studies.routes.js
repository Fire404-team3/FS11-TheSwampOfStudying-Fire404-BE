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

// --------- 1. POST /api/studies - 새 스터디 생성 -----------
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
    // catch 위 과정에서 에러가 발생하면 next(error) 출력
    next(error);
  }
});

// --------- 2. POST /api/studies/check-password - 비밀번호 검증 ------------
// 3,4를 위한 권한 확인용, 모달(비밀번호 인증) 성공 시 3(수정), 4(삭제)를 할 수 있도록 사용

// '/check' 주소로 post 요청 들어오면,
// (유효성 검사 추가? 미들웨어 처리 필요), req res를 담은 비동기 함수를 실행한다

// 에러 발생을 방지하기 위해 try catch문을 쓴다
// 사용자가 보낸 바디에서 { 스터디 아이디, 비밀번호 }를 꺼낸다
// 레포지토리를 통해 받은 아이디와 일치하는 스터디 정보를 데이터베이스에서 찾아온다

// 만약 찾아온 스터디 정보가 없으면 404 에러를 응답보낸다
// 만약 찾아온 스터디의 비밀번호가 사용사가 입력한 비밀번호와 일치한다면 200 성공을 보낸다

// 비밀번호가 다르다면 401 권한없음

// catch 위 과정에서 에러 발생시 next(error) 출력



// --------- 3. PATCH /api/studies/:id - 특정 스터디 수정 -----------
// { 비밀번호 }를 입력하여 (스터디 등록 시 입력했던 비밀번호와 일치할 경우), 스터디 정보 수정

// '/:id' 주소로 patch 요청 들어오면,
// (유효성 검사 추가? 미들웨어 처리 필요?), req res를 담은 비동기 함수를 실행한다

// 에러를 잡기 위해 try catch문을 사용

// 사용자가 보낸 주소창에서 { 스터디 아이디 }를 꺼내고,
// 바디에서 { 비밀번호, 수정할 내용 }을 꺼낸다

// 레포지토리를 통해 아이디와 일치하는 스터디를 찾아본다

// 만약 찾아온 스터디 정보가 없으면 404 error를 보낸다

// 만약 찾아온 스터디의 비밀번호가 사용자가 입력한 비밀번호와 다르다면 401(권한 없음)을 보낸다

// 비밀번호가 일치한다면 레포지토리를 통해 해당 스터디 정보를 새로운 내용으로 수정한다
// 수정이 완료되면 성공했다는 201번 코드와 방금 수정한 스터디 정보를 보내준다

// catch 위 과정에서 에러가 발생하면 next(error) 출력




// 4. DELETE /api/studies/:id - 특정 스터디 삭제
// { 비밀번호 } 를 입력하여 (스터디 등록 시 입력했던 비밀번호와 일치할 경우), 스터디 삭제

// '/:id' 주소로 patch 요청 들어오면,
// (유효성 검사 추가? 미들웨어 처리 필요?), req res를 담은 비동기 함수를 실행한다

// 에러를 잡기 위해 try catch문을 사용

// 사용자가 보낸 주소창에서 { 스터디 아이디 }를 꺼내고,
// 바디에서 { 비밀번호 }을 꺼낸다

// 레포지토리를 통해 아이디와 일치하는 스터디를 찾아본다

// 만약 찾아온 스터디 정보가 없으면 404 error를 보낸다

// 만약 찾아온 스터디의 비밀번호가 사용자가 입력한 비밀번호와 다르다면 401(권한 없음)을 보낸다

// 비밀번호가 일치한다면 레포지토리를 통해 해당 스터디를 삭제한다
// 삭제완료되면 204번 코드를 보낸다

// catch 위 과정에서 에러가 발생하면 next(error) 출력
