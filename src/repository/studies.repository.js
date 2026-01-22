import { prisma } from '#db/prisma.js';

export const studiesRepository = {
  findAndCountAll: async ({ where, orderBy, take, skip }) => {
    const [studies, totalCount] = await Promise.all([
      prisma.study.findMany({
        where,
        orderBy,
        take,
        skip,
      }),
      prisma.study.count({
        where,
      }),
    ]);
    return { studies, totalCount };
  },
};
