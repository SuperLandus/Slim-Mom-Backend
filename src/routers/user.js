import { Router } from 'express';
import {
  getDailyRateController,
  getMyDailyRateController,
} from '../controllers/user.js';
import validateBody from '../middlewares/validateBody.js';
import { addMyProductsSchema, getDailyRateSchema } from '../validation/user.js';
import { addMyProducts } from '../controllers/myProducts/addMyProducts.js';
import { getMyProducts } from '../controllers/myProducts/getMyProducts.js';
import { deleteMyProducts } from '../controllers/myProducts/deleteMyProducts.js';
import { countCalories } from '../controllers/myProducts/countCalories.js';
import { authenticate } from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/products',
  validateBody(addMyProductsSchema),
  authenticate,
  ctrlWrapper(addMyProducts),
);

router.get('/products', authenticate, ctrlWrapper(getMyProducts));
router.delete('/products/:id', authenticate, ctrlWrapper(deleteMyProducts));
router.get('/my-daily-calories', authenticate, ctrlWrapper(countCalories));

router.get(
  '/my-daily-calory-needs',
  authenticate,
  ctrlWrapper(getMyDailyRateController),
);

router.post(
  '/daily-calory-needs',
  validateBody(getDailyRateSchema),
  ctrlWrapper(getDailyRateController),
);

export default router;
