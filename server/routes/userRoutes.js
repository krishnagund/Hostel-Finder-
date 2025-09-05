import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData,toggleFavorite,getFavorites, updateUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData)
userRouter.post('/favorites/:propertyId', userAuth, toggleFavorite);
userRouter.get('/favorites', userAuth, getFavorites);
userRouter.put('/profile', userAuth, updateUserProfile);


export default userRouter