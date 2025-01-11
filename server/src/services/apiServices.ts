import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Show, SearchResponse } from '../types/show';

dotenv.config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const IMDB_BASE_URL = 'https://www.imdb.com/title';

if (!OMDB_API_KEY) {
  throw new Error('OMDB_API_KEY is not defined in environment variables');
}

interface IMDbResponse {
  Response: string;
  Error?: string;
  Search?: IMDbShow[];
  totalResults?: string;
}

interface IMDbShow {
  imdbID: string;
  Title: string;
  Type: string;
  Poster: string;
  Year: string;
}

interface IMDbDetails {
  imdbID: string;
  Title: string;
  Plot: string;
  Poster: string;
  Year: string;
  imdbRating: string;
  imdbVotes: string;
  Genre: string;
  Runtime: string;
  Released: string;
  Response: string;
  N_A?: 'N/A';
}

function processIMDbResponse(response: { data: IMDbResponse }): { shows: IMDbShow[]; totalResults: number } {
  if (response.data.Response === 'False') {
    console.error('OMDB API error:', response.data.Error);
    return { shows: [], totalResults: 0 };
  }

  if (!response.data.Search) {
    return { shows: [], totalResults: 0 };
  }

  console.log('OMDB Search Response:', {
    totalResults: response.data.totalResults,
    resultsCount: response.data.Search?.length || 0,
    firstResult: response.data.Search?.[0],
  });

  return {
    shows: response.data.Search,
    totalResults: parseInt(response.data.totalResults || '0', 10),
  };
}

async function enrichShowWithDetails(show: IMDbShow): Promise<Show> {
  const details = await getIMDbDetails(show.imdbID);
  return {
    id: show.imdbID,
    title: show.Title,
    description: details?.description || show.Type,
    poster: show.Poster !== 'N/A' ? show.Poster : undefined,
    year: show.Year,
    rating: details?.rating || 0,
    vikiRating: 0,
    vikiId: null,
    mdlRating: 0,
    mdlId: null,
    mdlHref: null
  };
}

async function scrapeIMDbRating(imdbId: string): Promise<number> {
  try {
    const response = await axios.get(`${IMDB_BASE_URL}/${imdbId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const ratingText = $('[data-testid="hero-rating-bar__aggregate-rating__score"] span:first-child').text();
    console.log('Scraped IMDb rating:', { imdbId, ratingText });
    
    return ratingText ? parseFloat(ratingText) : 0;
  } catch (error) {
    console.error('Error scraping IMDb rating:', error);
    return 0;
  }
}

export async function searchIMDb(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await axios.get<IMDbResponse>(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: query,
        type: 'series',
        page: page,
      },
    });

    const { shows, totalResults } = processIMDbResponse(response);
    if (shows.length === 0) {
      return { 
        shows: [], 
        totalResults,
        currentPage: page,
        totalPages: Math.ceil(totalResults / 10)
      };
    }

    const showsWithDetails = await Promise.all(shows.map(enrichShowWithDetails));
    return { 
      shows: showsWithDetails, 
      totalResults,
      currentPage: page,
      totalPages: Math.ceil(totalResults / 10)
    };
  } catch (error) {
    console.error('IMDb API error:', error);
    return { 
      shows: [], 
      totalResults: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}

export async function getIMDbDetails(imdbId: string): Promise<Show | null> {
  try {
    const response = await axios.get<IMDbDetails>(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId,
        plot: 'full',
      },
    });

    if (response.data.Response === 'False') {
      console.log('OMDB API returned False response for:', imdbId);
      return null;
    }

    let rating = response.data.imdbRating === 'N/A' ? 0 : parseFloat(response.data.imdbRating);
    
    // If no rating from OMDB, try scraping
    if (rating === 0) {
      console.log('No rating from OMDB, attempting to scrape for:', imdbId);
      rating = await scrapeIMDbRating(imdbId);
    }

    return {
      id: response.data.imdbID,
      title: response.data.Title,
      description: response.data.Plot,
      poster: response.data.Poster !== 'N/A' ? response.data.Poster : undefined,
      year: response.data.Year,
      rating: rating,
      vikiRating: 0,
      vikiId: null,
      mdlRating: 0,
      mdlId: null,
      mdlHref: null
    };
  } catch (error) {
    console.error('IMDb details API error for ID:', imdbId, error);
    return null;
  }
} 
