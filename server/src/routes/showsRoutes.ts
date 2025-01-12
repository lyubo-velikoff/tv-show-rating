import express from 'express';
import { searchShows, getShowDetails } from '../controllers/showController';
import { searchTmdbShowsEndpoint, getTmdbShowDetailsEndpoint } from '../controllers/searchTmdb';
import { getVikiRatingEndpoint } from '../controllers/vikiController';
import { getMDLRatingEndpoint } from '../controllers/mdlController';

const router = express.Router();

router.get('/search', searchShows);
router.get('/tmdb/:query', searchTmdbShowsEndpoint);
router.get('/tmdb/details/:id', getTmdbShowDetailsEndpoint);
router.get('/viki/:id', getVikiRatingEndpoint);
router.get('/mdl/:id', getMDLRatingEndpoint);
router.get('/:id', getShowDetails);

export default router;
