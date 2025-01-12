import express, { Request, Response } from 'express';
import { searchShows, getShowDetails } from '../controllers/showController';

const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchShows(req, res));
router.get('/:id', (req: Request, res: Response) => getShowDetails(req, res));

export default router; 
