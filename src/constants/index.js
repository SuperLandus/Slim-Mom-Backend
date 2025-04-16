// src/constants/index.js
import path from 'node:path';

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SWAGGER_PATH = path.join(
  process.cwd(),
  'src',
  'docs',
  'swagger.json',
);
