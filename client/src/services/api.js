import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function searchShows(query, page = 1) {
  try {
    const response = await api.get(
      `/api/shows/search?query=${query}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getShowDetails(id) {
  try {
    const response = await api.get(`/api/shows/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
