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

export const updateUserInfo = async (payload) => {
  return UserCollection.findOneAndUpdate(
    { _id: payload.owner }, // Query to find the user by their unique ID
    {
      'infouser.currentWeight': payload.currentWeight,
      'infouser.height': payload.height,
      'infouser.age': payload.age,
      'infouser.desiredWeight': payload.desiredWeight,
      'infouser.bloodType': payload.bloodType,
      'dailyRate': payload.dailyRate,
      'notAllowedProducts': payload.notAllowedFoods,
    },
    { new: true }, // Return the updated document
  );
};

export const getUserInfo = async (owner) => {
  return UserCollection.findById({ _id: owner });
};
