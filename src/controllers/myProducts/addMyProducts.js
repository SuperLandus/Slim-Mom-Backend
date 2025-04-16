import { MyProducts } from '../../db/models/MyProducts.model.js';
import mongoose from 'mongoose';

const addMyProducts = async (req, res) => {
  const { productId, productWeight, date } = req.body;
  const owner = req.user._id;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid productId' });
  }

  if (!date || isNaN(Date.parse(date))) {
    throw createHttpError(400, 'Invalid date!');
  }

  const dateFormatted = new Date(date).toISOString().split('T')[0];

  const newProduct = await MyProducts.create({
    productId,
    productWeight,
    date: dateFormatted,
    owner,
  });

  res.status(201).json({
    message: 'Product added to my products successfuly',
    product: newProduct,
  });
};

export { addMyProducts };
