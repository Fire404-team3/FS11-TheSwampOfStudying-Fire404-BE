import express from 'express';
import { router } from './routes/index.js';
import { config } from '#config';
import { prisma } from '#db/prisma.js';
import { cors, errorHandler } from '#middlewares';

const app = express();
app.use(express.json());

app.use(cors);

app.use('/', router);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
