import Joi from 'joi';

export const getDailyRateSchema = Joi.object({
  currentWeight: Joi.number().integer().min(30).max(300).required(),
  height: Joi.number().integer().min(100).max(220).required(),
  age: Joi.number().integer().min(18).max(100).required(),
  desiredWeight: Joi.number()
    .integer()
    .min(30)
    .max(300)
    .required()
    .when('currentWeight', {
      is: Joi.exist(),
      then: Joi.number().less(Joi.ref('currentWeight')).messages({
        'number.less': '"desiredWeight" must be less than "currentWeight"',
      }),
    }),
  bloodType: Joi.number().integer().min(1).max(4).required(),
});

export const addMyProductsSchema = Joi.object({
  productId: Joi.string().required(),
  productWeight: Joi.number().required(),
  date: Joi.date().required().messages({
    'date.base': 'Invalid date format',
    'date.format': 'Invalid date format, please use YYYY-MM-DD',
  }),
});
