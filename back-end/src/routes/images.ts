import { Router } from 'express';
import multer from 'multer';
import * as ImageController from '../controllers/image';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
    '/',
    ImageController.get
);

router.post(
    '/',
    upload.single('image'),
    ImageController.post
);

export default router;
