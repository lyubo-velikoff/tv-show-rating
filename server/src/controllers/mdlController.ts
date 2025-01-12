import { Request, Response } from 'express';
import { searchMDL } from '../services/mdlService';

export const getMDLRatingEndpoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching MDL rating for show ID: ${id}`);

    const mdlShows = await searchMDL(id);
    const mdlShow = mdlShows[0]; // Get the first match

    if (!mdlShow) {
      return res.json({ rating: 0, href: null });
    }

    res.json({
      rating: mdlShow.rating || 0,
      href: mdlShow.href || null
    });
  } catch (error) {
    console.error('❌ Error fetching MDL rating:', error);
    res.status(500).json({
      message: 'Failed to fetch MDL rating',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}; 
