import express from 'express';
import { searchShows, getShowDetails } from '../controllers/showController';
import { searchTmdbShowsEndpoint } from '../controllers/searchTmdb';

const router = express.Router();

router.get('/search', searchShows);
router.get('/:id', getShowDetails);
router.get('/tmdb/:query', searchTmdbShowsEndpoint);

export default router;
