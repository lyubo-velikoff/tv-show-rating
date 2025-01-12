import { Request, Response } from 'express';
import { searchTmdbShows, getTmdbShowDetails, TmdbShow } from '../services/tmdbService';
import { SearchResponse, Show } from '../types/show';

export const searchTmdbShowsEndpoint = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    console.log(`🔍 Received request to search TMDB for query: ${query}, page: ${page}`);

    const { shows, totalPages, totalResults } = await searchTmdbShows(query, page);

    const mappedShows: Show[] = shows
      .filter((show: TmdbShow) => show && show.id)
      .map((show: TmdbShow) => ({
        id: show.id.toString(),
        title: show.name,
        description: show.overview,
        poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear().toString() : undefined
      }))
      .slice(0, 10);

    const response: SearchResponse = {
      shows: mappedShows,
      totalResults: Math.min(totalResults, 100),
      currentPage: page,
      totalPages: Math.min(totalPages, 10)
    };

    console.log(`✅ Successfully fetched ${mappedShows.length} shows from TMDB for query: ${query}`);
    res.json(response);
  } catch (error) {
    console.error('❌ Error searching TMDB shows:', error);
    res.status(500).json({
      message: 'Failed to search TMDB shows',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const getTmdbShowDetailsEndpoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Received request to get TMDB show details for ID: ${id}`);

    const show = await getTmdbShowDetails(parseInt(id));
    
    const mappedShow: Show = {
      id: show.id.toString(),
      title: show.name,
      description: show.overview,
      poster: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
      rating: show.vote_average,
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear().toString() : undefined
    };

    console.log(`✅ Successfully fetched TMDB show details for ID: ${id}`);
    res.json(mappedShow);
  } catch (error) {
    console.error('❌ Error fetching TMDB show details:', error);
    res.status(500).json({
      message: 'Failed to fetch TMDB show details',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
