//Merge시 Habit Modal 통합 테스트를 위한 임시코드 삭제가 필요합니다.
import express from 'express';
import { prisma } from '#db/prisma.js';
export const testRouter = express.Router(); 

testRouter.get('/:studyId', async (req, res) => {
  const { studyId } = req.params;

  try {
    const study = await prisma.study.findUnique({
      where: { id: studyId },
      include: {
        habits: {
          where: { isDeleted: false },
        },
      },
    });

    if (!study) return res.status(404).json({ message: 'Study not found' });

    res.json(study);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});