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
