import { prisma } from '#db/prisma.js';

// 스터디 생성
function createStudy(data) {
  return prisma.study.create({
    data,
  });
}

// 검증용, ID로 스터디 찾기
function findStudyById(id) {
  return prisma.study.findUnique({
    where: { id: id },
  });
}

// 스터디 수정
function updateStudy(id, data) {
  return prisma.study.update({
    where: { id: id },
    data,
  });
}

// 스터디 삭제
function deleteStudy(id) {
  return prisma.study.delete({
    where: { id: id },
  });
}

export const studiesRepository = {
  createStudy,
  findStudyById,
  updateStudy,
  deleteStudy,
};
