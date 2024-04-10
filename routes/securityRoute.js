// api/routes/securityRoutes.js
import express from 'express';
import { generateZAPFile } from '../controllers/securityController.js';

const router = express.Router();

router.post('/generate', generateZAPFile);

export default router;
