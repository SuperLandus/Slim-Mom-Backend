import { MyProducts } from '../db/models/MyProducts.model.js';
import Product from '../db/models/products.js';
import UserCollection from '../db/models/users.js';

export const getNotAllowedFoodsService = async (bloodType) => {
  return await Product.distinct('categories', {
    [`groupBloodNotAllowed.${bloodType}`]: true,
  });
};

export const getProductsForDateService = async (owner, date) => {
  return MyProducts.find({
    owner,
    date,
  })
    .populate({ path: 'productId', select: '-groupBloodNotAllowed -weight' })
    .select('-owner -__v ');
};

export const updateUserInfo = async (owner, payload) => {
  return UserCollection.findOneAndUpdate(
    { _id: owner }, // Query to find the user by their unique ID
    {
      currentWeight: payload.currentWeight,
      height: payload.height,
      age: payload.age,
      desiredWeight: payload.desiredWeight,
      bloodType: payload.bloodType,
      dailyRate: payload.dailyRate,
      notAllowedProducts: payload.notAllowedFoods,
    },
    { new: true }, // Return the updated document
  );
};
