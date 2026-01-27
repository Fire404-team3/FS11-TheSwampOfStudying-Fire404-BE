import { ERROR_MESSAGE } from '#constants';
import { NotFoundException, UnauthorizedException } from '#exceptions';
import { studiesRepository } from '#repository';

// 스터디 소유권 확인 미들웨어
// [스터디 조회 -> 404 -> 비밀번호 비교 -> 401] 반복 로직 통합
export const checkStudyOwner = async (req, res, next) => {
  try {
    // 사용자가 보낸 주소창에서 { 스터디 아이디 }를 꺼내고,
    // 바디에서 { 비밀번호 }을 꺼낸다
    const { id } = req.params;
    const { password } = req.body;

    // 레포지토리를 통해 아이디와 일치하는 스터디를 찾아본다
    const study = await studiesRepository.findStudyById(id);

    // 만약 찾아온 스터디 정보가 없으면 404 error를 보낸다
    if (!study) {
      throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
    }

    // 만약 찾아온 스터디의 비밀번호가 사용자가 입력한 비밀번호와 다르다면 401(권한 없음)을 보낸다
    if (study.password !== password) {
      throw new UnauthorizedException(ERROR_MESSAGE.PASSWORD_REQUIRED);
    }

    next();
  } catch (error) {
    next(error);
  }
};
