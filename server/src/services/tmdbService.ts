import axios from 'axios';
import { searchViki } from './vikiService';
import { searchMDL } from './mdlService';
import { searchIMDb } from './apiServices';
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
  poster: string;
}

export const searchTmdbShows = async (query: string): Promise<TmdbShow[]> => {
  console.log(`🔍 Searching TMDB API for query: ${query}`);

  const tmdbResponse = await axios.get(`${TMDB_API_URL}/search/tv`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
    },
  });

  const tmdbShows = tmdbResponse.data.results.map((show: any) => ({
    id: show.id,
    name: show.name,
    overview: show.overview,
    vote_average: show.vote_average,
    poster: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
  }));

  const [vikiShows, mdlShows, imdbResponse] = await Promise.all([
    searchViki(query),
    searchMDL(query),
    searchIMDb(query, 1)
  ]);

  // Extract shows array from IMDb SearchResponse
  const imdbShows = (imdbResponse as SearchResponse).shows;

  // Combine results from all platforms
  const combinedShows = [...tmdbShows, ...vikiShows, ...mdlShows, ...imdbShows];

  console.log('✅ Combined API results:', {
    query,
    resultsCount: combinedShows.length,
    combinedShows,
  });

  return combinedShows;
};
