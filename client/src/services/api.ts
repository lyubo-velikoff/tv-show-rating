import axios from 'axios';
import { Show, SearchResponse } from '../types/show';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function searchShows(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await api.get<SearchResponse>(
      `/api/shows/search?query=${query}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getShowDetails(id: string): Promise<Show | null> {
  try {
    const response = await api.get<Show>(`/api/shows/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
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
