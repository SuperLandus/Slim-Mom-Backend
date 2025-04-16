import createHttpError from 'http-errors';
import { getProductsForDateService } from '../../services/user.js';

const getMyProducts = async (req, res) => {
  const { date } = req.query;
  if (!date || isNaN(Date.parse(date))) {
    throw createHttpError(400, 'Invalid date!');
  }
  const owner = req.user._id;
  const dateFormatted = new Date(date).toISOString().split('T')[0];
  const products = await getProductsForDateService(owner, dateFormatted);

  if (!products.length) {
    res
      .status(200)
      .json({ message: 'No product found for this date!', products: [] });
  }
  res.status(200).json({ message: 'Successfully got products!', products });
};

export { getMyProducts };
