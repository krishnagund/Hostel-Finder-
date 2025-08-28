import express from 'express';
import {
  createProperty,
  getUserProperties,
  getAllProperties,
  getPropertiesByCity
} from '../controllers/propertyController.js';

import userAuth from '../middleware/userAuth.js';
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hostel-finder",              // any folder name
    allowed_formats: ["jpg","jpeg","png"],
    // You can pre-optimize on upload if you like:
    // transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const upload = multer({ storage });

router.post('/add', userAuth, upload.array('roomImages', 10), createProperty);


router.get('/my-properties', userAuth, getUserProperties);
router.get('/all-properties', getAllProperties);
router.get('/search/:city', getPropertiesByCity);

export default router;
