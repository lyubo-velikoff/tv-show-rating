import axios from 'axios';

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
  poster_path: string;
}

export const searchTmdbShows = async (query: string): Promise<TmdbShow[]> => {
  console.log(`🔍 Searching TMDB API for query: ${query}`);

  const response = await axios.get(`${TMDB_API_URL}/search/tv`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
    },
  });

  console.log('📡 TMDB API Response:', response.data);

  if (response.data.results.length === 0) {
    console.log('❌ No shows found for query:', query);
    throw new Error('No shows found');
  }

  const shows = response.data.results.map((show: any) => ({
    id: show.id,
    name: show.name,
    overview: show.overview,
    vote_average: show.vote_average,
    poster: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
  }));

  console.log('✅ TMDB API results:', {
    query,
    resultsCount: shows.length,
    shows,
  });

  return shows;
};
