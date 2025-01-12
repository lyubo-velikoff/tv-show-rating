import express from 'express';
import { searchShows, getShowDetails } from '../controllers/showController';
import { searchTmdbShowsEndpoint, getTmdbShowDetailsEndpoint } from '../controllers/searchTmdb';
import { getIMDbRatingEndpoint } from '../controllers/imdbController';

const router = express.Router();

router.get('/search', searchShows);
router.get('/details/:id', getShowDetails);
router.get('/tmdb/:query', searchTmdbShowsEndpoint);
router.get('/tmdb/details/:id', getTmdbShowDetailsEndpoint);
router.get('/imdb/:id', getIMDbRatingEndpoint);

export default router; 
