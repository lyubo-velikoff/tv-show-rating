import axios from 'axios';
import { Show } from '../types/show';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface SearchResponse {
  shows: Show[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export async function searchShows(query: string, page: number = 1): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>(`/api/shows/tmdb/${encodeURIComponent(query)}?page=${page}`);
  return response.data;
}

export async function getShowDetails(id: string): Promise<Show> {
  const response = await api.get<Show>(`/api/shows/tmdb/details/${id}`);
  return response.data;
}

export async function getFavorites(): Promise<Show[]> {
  const response = await api.get<Show[]>('/api/favorites');
  return response.data;
}

export async function addToFavorites(show: Show): Promise<void> {
  await api.post('/api/favorites', show);
}

export async function removeFromFavorites(showId: string): Promise<void> {
  await api.delete(`/api/favorites/${showId}`);
}
