import 'reflect-metadata';
import './database/index';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import UploadConfig from './config/upload';
import routes from './routes';
import AppError from './error/AppError';

const app = express();

app.use('/files', express.static(UploadConfig.directory));
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});
export default app;
