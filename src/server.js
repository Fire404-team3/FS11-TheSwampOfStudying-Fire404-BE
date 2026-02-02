import express from 'express';
import { config } from '#config';
import { prisma } from '#db/prisma.js';
import { getSwaggerDoc, swaggerUiServe, swaggerUiSetup } from './swagger.js';
import { cors, errorHandler } from '#middlewares';
import { router } from './routes/index.js';

const app = express();
app.use(express.json());

app.use(cors);

// swagger
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(getSwaggerDoc()));

app.use('/', router);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
