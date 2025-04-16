import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    categories: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    groupBloodTypeNotAllowed: {
      1: { type: Boolean, required: true },
      2: { type: Boolean, required: true },
      3: { type: Boolean, required: true },
      4: { type: Boolean, required: true },
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const Product = model('product', productSchema);

export default Product;
