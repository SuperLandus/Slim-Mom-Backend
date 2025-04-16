import { Router } from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import productRouter from './product.js';

const router = Router();

router.use('/products', productRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
