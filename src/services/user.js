import { MyProducts } from '../db/models/MyProducts.model.js';
import Product from '../db/models/products.js';

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
