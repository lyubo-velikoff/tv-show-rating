import { Request, Response } from 'express';
import { addFavorite, removeFavorite, getFavorites, FavoriteShow } from '../services/favoritesService';

export function addFavoriteHandler(req: Request, res: Response): void {
  const show: FavoriteShow = req.body;
  addFavorite(show);
  res.status(200).json({ message: 'Show added to favorites' });
}

export function removeFavoriteHandler(req: Request, res: Response): void {
  const { id } = req.params;
  removeFavorite(id);
  res.status(200).json({ message: 'Show removed from favorites' });
}

export function getFavoritesHandler(req: Request, res: Response): void {
  const favorites = getFavorites();
  res.status(200).json(favorites);
}
