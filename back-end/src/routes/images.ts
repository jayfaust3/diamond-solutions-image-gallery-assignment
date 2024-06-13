import { Router } from 'express';
import * as ImageController from '../controllers/image';

const router = Router();

router.get('/', ImageController.get);
router.post('/', ImageController.post);

export default router;
