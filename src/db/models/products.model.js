const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  categories: { type: String },
  weight: {
    type: Number,
    required: true,
  },
  title: { type: String, required: true },
  calories: {
    type: Number,
    required: true,
  },
  groupBloodNotAllowed: [{ type: Boolean, required: true }],
});

const Product = model('product', productSchema);

module.exports = { Product };
