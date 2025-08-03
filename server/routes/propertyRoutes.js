import express from 'express';
import { createProperty,getUserProperties,getAllProperties } from '../controllers/propertyController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/add', userAuth, createProperty);
router.get('/my-properties', userAuth, getUserProperties);
router.get('/all-properties', getAllProperties);

export default router;

