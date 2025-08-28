import express from 'express';
import { getStats,gettopcity,translateTextHandler} from '../controllers/statsController.js';

const router = express.Router();

// GET /api/stats
router.get("/", getStats);
router.get("/top-cities",gettopcity)
router.post("/translate",translateTextHandler)

export default router
