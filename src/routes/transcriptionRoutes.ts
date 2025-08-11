import { Router } from 'express';
import transcriptionController from '../controllers/transcriptionController';

const router = Router();

router.post('/', transcriptionController.createTranscription);

export default router;
