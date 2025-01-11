import express from 'express';
import { searchShows, getShowDetails } from '../controllers/showController.js';

const router = express.Router();

router.get('/search', searchShows);
router.get('/:id', getShowDetails);

export default router;
