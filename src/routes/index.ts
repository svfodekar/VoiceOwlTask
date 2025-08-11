import { Router } from 'express';
import transcriptionRoutes from './transcriptionRoutes';
// import userRoutes from './userRoutes';
// import projectRoutes from './projectRoutes';
// import other routes...

const router = Router();


// All Base route → Route handler
router.use('/transcription', transcriptionRoutes);
// router.use('/users', userRoutes);
// router.use('/projects', projectRoutes);
// add more routes here


export default router;
