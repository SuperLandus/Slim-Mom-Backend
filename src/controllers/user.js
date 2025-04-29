import { calculateDailyCalory } from '../utils/calculateCalory.js';
import createHttpError from 'http-errors';
import {
  getNotAllowedFoodsService,
  getUserInfo,
  updateUserInfo,
} from '../services/user.js';

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
  const owner = req.user._id;

  const userInfo = await getUserInfo(owner);

  const userLastInfo = {
    currentWeight: userInfo.infouser.currentWeight,
    height: userInfo.infouser.height,
    age: userInfo.infouser.age,
    bloodType: userInfo.infouser.bloodType,
    desiredWeight: userInfo.infouser.desiredWeight,
  };

  const notAllowedFoods = await getNotAllowedFoodsService(
    userLastInfo.bloodType,
  );

  const dailyRate = calculateDailyCalory(
    userLastInfo.currentWeight,
    userLastInfo.height,
    userLastInfo.age,
    userLastInfo.desiredWeight,
  );

  res.status(200).json({
    status: 200,
    message: 'successfully got daily rate!',
    data: { dailyRate, notAllowedFoods },
  });
};

export const updateUserController = async (req, res, next) => {
  const owner = req.user._id;

  await updateUserInfo({
    owner,
    currentWeight: Number(req.body.currentWeight),
    height: Number(req.body.height),
    age: Number(req.body.age),
    desiredWeight: Number(req.body.desiredWeight),
    bloodType: Number(req.body.bloodType),
  });

  const notAllowedFoods = await getNotAllowedFoodsService(req.body.bloodType);

  const dailyRate = calculateDailyCalory(
    req.body.currentWeight,
    req.body.height,
    req.body.age,
    req.body.desiredWeight,
  );

  res.status(200).json({
    status: 200,
    message: 'successfully updated daily rate!',
    data: { dailyRate, notAllowedFoods },
  });
};
