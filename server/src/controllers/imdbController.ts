import { Request, Response } from 'express';
import { getIMDbDetails } from '../services/apiServices';

export const getIMDbRatingEndpoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching IMDb rating for show ID: ${id}`);

    const imdbShow = await getIMDbDetails(id);

    if (!imdbShow) {
      return res.json({ rating: 0, href: null });
    }

    res.json({
      rating: imdbShow.rating || 0,
      href: `https://www.imdb.com/title/${id}/`
    });
  } catch (error) {
    console.error('❌ Error fetching IMDb rating:', error);
    res.status(500).json({
      message: 'Failed to fetch IMDb rating',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}; 
