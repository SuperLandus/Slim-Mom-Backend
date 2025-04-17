import { calculateDailyCalory } from '../utils/calculateCalory.js';
import createHttpError from 'http-errors';
import { getNotAllowedFoodsService, updateUserInfo } from '../services/user.js';

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

  const {
    currentWeight,
    height: height, // typo düzeltmesi: 'heigth' → 'height'
    age,
    desiredWeight,
    bloodType,
  } = req.body;

  const notAllowedFoods = await getNotAllowedFoodsService(bloodType);

  const dailyRate = calculateDailyCalory({
    currentWeight,
    height,
    age,
    desiredWeight,
  });
  const owner = req.user._id;
  await updateUserInfo({
    owner,
    currentWeight: Number(currentWeight),
    height: Number(height),
    age: Number(age),
    desiredWeight: Number(desiredWeight),
    bloodType: Number(bloodType),
    dailyRate,
    notAllowedFoods,
  });
  res.status(200).json({
    status: 200,
    message: 'successfully got daily rate!',
    data: { dailyRate, notAllowedFoods },
  });
};
