import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  throw createHttpError(404, `No route defined as ${req.originalUrl}`);
};
