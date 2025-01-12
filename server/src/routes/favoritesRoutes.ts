import express from 'express';
import { addFavoriteHandler, removeFavoriteHandler, getFavoritesHandler } from '../controllers/favoritesController';

const router = express.Router();

router.post('/', addFavoriteHandler);
router.delete('/:id', removeFavoriteHandler);
router.get('/', getFavoritesHandler);

export default router;
