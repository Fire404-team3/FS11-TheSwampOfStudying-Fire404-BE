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

//오늘의 습관
//특정 study(id)의 정보(id, name, nickname)와 연관된 habits를 조회
function findStudyWithHabits(id) {
  return prisma.study.findUnique({
    where: { id: String(id) },
    select: {
      // id: true,
      name: true,
      nickname: true,
      habits: true,
    },
  });
}

function fetchAllResources(id) {
  return prisma.study.findUnique({
    where: { id: String(id) },
    include: {
      habits: {
        include: { records: true },
      },
      emojiLogs: true,
    },
  });
}

export const studiesRepository = {
  createStudy,
  findStudyById,
  updateStudy,
  deleteStudy,
  //오늘의 습관
  findStudyWithHabits,
  fetchAllResources,
};
