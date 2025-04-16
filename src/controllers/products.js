import Product from '../db/models/products.js';
import { errorHandler } from '../middlewares/errorHandler.js';

export async function getProductsByQuery(req, res, next) {
  let { title } = req.query;
  if (!title) {
    next(errorHandler);
    return;
  }
  const regex = new RegExp(title || '', 'i');
  const data = await Product.find({ title: regex }).limit(10);
  res.status(200).json({
    message: 'Products matching your search',
    data: data,
  });
}
