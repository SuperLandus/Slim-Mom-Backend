import createHttpError from 'http-errors';
import { MyProducts } from '../../db/models/MyProducts.model.js';
import mongoose from 'mongoose';

const deleteMyProducts = async (req, res) => {
  const { date } = req.query;
  const { id } = req.params;
  const owner = req.user._id;

  if (!date || isNaN(Date.parse(date))) {
    throw createHttpError(400, 'Invalid date!');
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    throw createHttpError(400, `Invalid ID: ${id}`);

  const dateFormatted = new Date(date).toISOString().split('T')[0];

  const deletedProduct = await MyProducts.findOneAndDelete({
    productId: id,
    owner,
    date: dateFormatted,
  });

  if (!deletedProduct) {
    return res.status(404).json({
      message: `No product found with this id (${id}) or specified date (${date})!`,
    });
  }

  res.status(204).json({ message: 'Product deleted!', deletedProduct });
};

export { deleteMyProducts };
