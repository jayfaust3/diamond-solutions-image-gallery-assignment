import { Router } from 'express';
import * as ImageController from '../controllers/image';

const router = Router();

/* GET users listing. */
router.get('/', ImageController.get);

export default router;
