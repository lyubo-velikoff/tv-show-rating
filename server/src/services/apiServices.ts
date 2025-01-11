import dotenv from 'dotenv';
import axios from 'axios';
import { IMDbResponse } from '../types/show';

dotenv.config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;

if (!OMDB_API_KEY) {
  throw new Error('OMDB_API_KEY is not defined in environment variables');
}

export async function searchIMDb(query: string, page: number): Promise<IMDbResponse> {
  try {
    console.log('🔍 Searching OMDB for:', query);
    const searchUrl = `https://www.omdbapi.com?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
      query
    )}&type=series&page=${page}`;
    console.log('OMDB Search Request URL:', searchUrl);

    const response = await axios.get(searchUrl);
    const data = response.data;

    if (data.Error) {
      console.error('OMDB Search Error:', data.Error);
      return { shows: [], totalResults: '0' };
    }

    console.log('OMDB Search Response:', {
      totalResults: data.totalResults,
      resultsCount: data.Search?.length || 0,
      firstResult: data.Search?.[0] || 'No results',
    });

    const shows = await Promise.all(
      (data.Search || []).map(async (item: any) => {
        const details = await getIMDbDetails(item.imdbID);
        return {
          id: item.imdbID,
          title: item.Title,
          year: item.Year,
          poster: item.Poster,
          rating: details.rating,
          description: details.description,
        };
      })
    );

    return {
      shows,
      totalResults: data.totalResults,
    };
  } catch (error) {
    console.error('OMDB Search error:', error);
    return { shows: [], totalResults: '0' };
  }
}

async function getIMDbDetails(imdbId: string) {
  try {
    const detailUrl = `https://www.omdbapi.com?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`;
    console.log('OMDB Details Request URL:', detailUrl);

    const response = await axios.get(detailUrl);
    const data = response.data;

    console.log('OMDB Details Response:', {
      title: data.Title,
      rating: data.imdbRating,
      year: data.Year,
    });

    return {
      rating: parseFloat(data.imdbRating) || 0,
      description: data.Plot,
    };
  } catch (error) {
    console.error('OMDB Details error:', error);
    return { rating: 0, description: '' };
  }
} 
