import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export interface FavoriteShow {
  id: string;
  title: string;
  poster: string;
}

export function addFavorite(show: FavoriteShow): void {
  const favorites = cache.get<FavoriteShow[]>('favorites') || [];
  if (!favorites.find(fav => fav.id === show.id)) {
    favorites.push(show);
    cache.set('favorites', favorites);
  }
}

export function removeFavorite(showId: string): void {
  const favorites = cache.get<FavoriteShow[]>('favorites') || [];
  const updatedFavorites = favorites.filter(fav => fav.id !== showId);
  cache.set('favorites', updatedFavorites);
}

export function getFavorites(): FavoriteShow[] {
  return cache.get<FavoriteShow[]>('favorites') || [];
}
