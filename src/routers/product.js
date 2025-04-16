import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getProductsByQuery } from '../controllers/products.js';

const router = Router();

router.get('/searchProducts', ctrlWrapper(getProductsByQuery));

export default router;
