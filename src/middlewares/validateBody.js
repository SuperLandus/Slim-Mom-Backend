import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  schema
    .validateAsync(req.body, { abortEarly: false })
    .then(() => next())
    .catch((e) => {
      const errorMessages = e.details.map((detail) => detail.message);
      const error = createHttpError(400, 'Validation error', {
        errors: errorMessages,
      });
      next(error);
    });
};
export default validateBody;
