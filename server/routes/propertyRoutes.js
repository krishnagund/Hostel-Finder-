import express from 'express';
import { createProperty,getUserProperties,getAllProperties,getPropertiesByCity } from '../controllers/propertyController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/add', userAuth, createProperty);
router.get('/my-properties', userAuth, getUserProperties);
router.get('/all-properties', getAllProperties);
router.get('/search/:city', getPropertiesByCity);

export default router;

