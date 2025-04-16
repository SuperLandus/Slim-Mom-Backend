import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ctrlWrapper } from './utils/ctrlWrapper.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', 3000));
const app = express();

export const startServer = () => {
  app.use(cors());

  app.use(express.json());
  app.use(cookieParser());

  app.use(router);
  app.use('/api-docs', swaggerDocs());
  app.use('*', ctrlWrapper(notFoundHandler));
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
