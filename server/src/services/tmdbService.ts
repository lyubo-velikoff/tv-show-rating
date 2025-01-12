import axios from 'axios';
import { SearchResponse } from '../types/show';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error('TMDB_API_KEY is not defined in environment variables');
}

export interface TmdbShow {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  poster_path?: string;
  first_air_date?: string;
}

export interface TmdbSearchResponse {
  shows: TmdbShow[];
  totalPages: number;
  totalResults: number;
}

export const searchTmdbShows = async (query: string, page: number = 1): Promise<TmdbSearchResponse> => {
  console.log(`🔍 Searching TMDB API for query: ${query}, page: ${page}`);

  const response = await axios.get(`${TMDB_API_URL}/search/tv`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
      page
    },
  });

  const shows = response.data.results.map((show: any) => ({
    id: show.id,
    name: show.name,
    overview: show.overview,
    vote_average: show.vote_average,
    poster_path: show.poster_path,
    first_air_date: show.first_air_date
  }));

  return {
    shows,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results
  };
};

export const getTmdbShowDetails = async (id: number): Promise<TmdbShow> => {
  console.log(`🔍 Fetching TMDB show details for ID: ${id}`);

  const response = await axios.get(`${TMDB_API_URL}/tv/${id}`, {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return {
    id: response.data.id,
    name: response.data.name,
    overview: response.data.overview,
    vote_average: response.data.vote_average,
    poster_path: response.data.poster_path,
    first_air_date: response.data.first_air_date
  };
};
