import { Request, Response } from 'express';
import { searchTmdbShows, TmdbShow } from '../services/tmdbService';
import { SearchResponse, Show } from '../types/show';

export const searchTmdbShowsEndpoint = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    console.log(`🔍 Received request to search TMDB for query: ${query}`);

    const tmdbShows: TmdbShow[] = await searchTmdbShows(query);

    const mappedShows: Show[] = tmdbShows
      .filter(show => show && show.id) // Filter out any undefined or invalid shows
      .map(show => ({
        id: (show.id || '').toString(),
        title: show.name || 'Unknown Title',
        description: show.overview || '',
        poster: show.poster || undefined,
        rating: typeof show.vote_average === 'number' ? show.vote_average : 0,
        vikiRating: 0,
        vikiId: null,
        vikiHref: null,
        mdlRating: 0,
        mdlId: null,
        mdlHref: null,
        year: new Date().getFullYear().toString() // TODO: Extract year from TMDB data if available
      }));

    const response: SearchResponse = {
      shows: mappedShows,
      totalResults: mappedShows.length,
      currentPage: 1,
      totalPages: 1
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
