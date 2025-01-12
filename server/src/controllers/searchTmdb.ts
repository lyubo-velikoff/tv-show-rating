import { Request, Response } from 'express';
import { searchTmdbShows, TmdbShow } from '../services/tmdbService';

export const searchTmdbShowsEndpoint = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    console.log(`🔍 Received request to search TMDB for query: ${query}`);

    const shows: TmdbShow[] = await searchTmdbShows(query);

    console.log(`✅ Successfully fetched ${shows.length} shows from TMDB for query: ${query}`);
    res.json(shows);
  } catch (error) {
    console.error('❌ Error searching TMDB shows:', error);
    res.status(500).json({
      message: 'Failed to search TMDB shows',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};
