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
  try {
    const [tmdbResponse, vikiResponse, mdlResponse, imdbResponse] = await Promise.all([
      api.get<Show>(`/api/shows/tmdb/details/${id}`),
      api.get<{ rating: number; href: string }>(`/api/shows/viki/${id}`).catch(() => null),
      api.get<{ rating: number; href: string }>(`/api/shows/mdl/${id}`).catch(() => null),
      api.get<{ rating: number; href: string }>(`/api/shows/imdb/${id}`).catch(() => null)
    ]);

    return {
      ...tmdbResponse.data,
      vikiRating: vikiResponse?.data?.rating,
      vikiHref: vikiResponse?.data?.href,
      mdlRating: mdlResponse?.data?.rating,
      mdlHref: mdlResponse?.data?.href,
      imdbHref: imdbResponse?.data?.href
    };
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw error;
  }
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
