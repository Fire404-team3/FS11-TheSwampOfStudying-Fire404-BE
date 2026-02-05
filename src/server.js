import express from 'express';
import { router } from './routes/index.js';
import { config } from '#config';
import { prisma } from '#db/prisma.js';
import { errorHandler } from '#middlewares';
import corsMiddleware from './middlewares/cors.middleware.js';

const app = express();
app.use(express.json());

app.use(corsMiddleware);
app.options(/.*/, corsMiddleware);

app.use('/', router);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
