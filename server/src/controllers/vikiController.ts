import { Request, Response } from 'express';
import { searchViki } from '../services/vikiService';

export const getVikiRatingEndpoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching Viki rating for show ID: ${id}`);

    const vikiShows = await searchViki(id);
    const vikiShow = vikiShows[0]; // Get the first match

    if (!vikiShow) {
      return res.json({ rating: 0, href: null });
    }

    res.json({
      rating: vikiShow.rating || 0,
      href: vikiShow.href || null
    });
  } catch (error) {
    console.error('❌ Error fetching Viki rating:', error);
    res.status(500).json({
      message: 'Failed to fetch Viki rating',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}; 
