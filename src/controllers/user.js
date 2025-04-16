import { calculateDailyCalory } from '../utils/calculateCalory.js';
import createHttpError from 'http-errors';
import { getNotAllowedFoodsService } from '../services/user.js';

export const getDailyRateController = async (req, res, next) => {
  const currentWeight = Number(req.body.currentWeight);
  const height = Number(req.body.height);
  const age = Number(req.body.age);
  const desiredWeight = Number(req.body.desiredWeight);
  const bloodType = Number(req.body.bloodType);

  const notAllowedFoods = await getNotAllowedFoodsService(bloodType);

  const dailyRate = calculateDailyCalory({
    currentWeight,
    height,
    age,
    desiredWeight,
  });

  res.status(200).json({
    status: 200,
    message: 'successfully got daily rate!',
    data: { dailyRate, notAllowedFoods },
  });
};

export const getMyDailyRateController = async (req, res, next) => {
  if (!req.user) {
    next(createHttpError(401, 'You are not authorized!'));
  }
  const currentWeight = Number(req.user.currentWeight);
  const height = Number(req.user.height);
  const age = Number(req.user.age);
  const desiredWeight = Number(req.user.desiredWeight);
  const bloodType = Number(req.user.bloodType);

  const notAllowedFoods = await getNotAllowedFoodsService(bloodType);

  const dailyRate = calculateDailyCalory({
    currentWeight,
    height,
    age,
    desiredWeight,
  });

  res.status(200).json({
    status: 200,
    message: 'successfully got daily rate!',
    data: { dailyRate, notAllowedFoods },
  });
};
