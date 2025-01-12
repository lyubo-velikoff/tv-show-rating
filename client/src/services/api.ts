import axios from 'axios';
import { Show, SearchResponse } from '../types/show';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function searchShows(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await api.get<SearchResponse>(`/api/shows/tmdb/${encodeURIComponent(query)}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getShowDetails(id: string): Promise<Show> {
  try {
    const [tmdbResponse, vikiResponse, mdlResponse] = await Promise.all([
      api.get<Show>(`/api/shows/tmdb/details/${id}`),
      api.get<{ rating: number; href: string }>(`/api/shows/viki/${id}`).catch(() => null),
      api.get<{ rating: number; href: string }>(`/api/shows/mdl/${id}`).catch(() => null)
    ]);

    return {
      ...tmdbResponse.data,
      vikiRating: vikiResponse?.data.rating,
      vikiHref: vikiResponse?.data.href,
      mdlRating: mdlResponse?.data.rating,
      mdlHref: mdlResponse?.data.href
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getFavorites(): Promise<Show[]> {
  try {
    const response = await api.get<Show[]>('/api/favorites');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function addFavorite(show: Show): Promise<void> {
  try {
    await api.post('/api/favorites', show);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function removeFavorite(id: string): Promise<void> {
  try {
    await api.delete(`/api/favorites/${id}`);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function searchTmdbShows(query: string): Promise<Show[]> {
  try {
    const response = await api.get<Show[]>(`/api/shows/tmdb/${query}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
