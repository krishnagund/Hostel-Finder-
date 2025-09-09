import express from 'express';
import { createSavedSearch, listSavedSearches, deleteSavedSearch } from '../controllers/savedSearchController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/', userAuth, createSavedSearch);
router.get('/', userAuth, listSavedSearches);
router.delete('/:id', userAuth, deleteSavedSearch);

export default router;


