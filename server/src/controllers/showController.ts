import { Request, Response } from 'express';
import { searchIMDb } from '../services/apiServices';
import { searchViki } from '../services/vikiService';
import { searchMDL } from '../services/mdlService';
import { cacheService } from '../services/cacheService';
import { SearchResponse, Show } from '../types/show';

export const searchShows = async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;

    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Query parameter must be a string' });
    }

    const cacheKey = `${query}_page${page}`;

    // Check cache first
    const cachedResults = cacheService.get<SearchResponse>(cacheKey);
    if (cachedResults) {
      return res.json(cachedResults);
    }

    // Fetch results from all sources
    const [imdbResults, vikiResults, mdlResults] = await Promise.all([
      searchIMDb(query, Number(page)),
      searchViki(query),
      searchMDL(query),
    ]);

    // Match shows from both sources by title similarity
    const combinedShows = imdbResults.shows.map((imdbShow) => {
      const vikiShow = vikiResults.find(
        (vs) =>
          vs.title.toLowerCase().includes(imdbShow.title.toLowerCase()) ||
          imdbShow.title.toLowerCase().includes(vs.title.toLowerCase())
      );

      const mdlShow = mdlResults.find(
        (ms) =>
          ms.title.toLowerCase().replace(/[^\w\s]/g, '') ===
            imdbShow.title.toLowerCase().replace(/[^\w\s]/g, '') ||
          ms.title.toLowerCase().includes(imdbShow.title.toLowerCase()) ||
          imdbShow.title.toLowerCase().includes(ms.title.toLowerCase())
      );

      console.log('🔍 Matching shows:', {
        imdbTitle: imdbShow.title,
        vikiShow: vikiShow
          ? {
              title: vikiShow.title,
              rating: vikiShow.rating,
              vikiId: vikiShow.vikiId,
            }
          : 'No match',
        mdlShow: mdlShow
          ? {
              title: mdlShow.title,
              rating: mdlShow.rating,
              mdlId: mdlShow.mdlId,
            }
          : 'No match',
      });

      return {
        ...imdbShow,
        vikiRating: vikiShow?.rating || 0,
        vikiId: vikiShow?.vikiId || null,
        mdlRating: mdlShow?.rating || 0,
        mdlId: mdlShow?.mdlId || null,
      };
    });

    // Filter out results with missing posters or titles
    const validResults = combinedShows.filter(
      (show): show is Show => Boolean(show.title && show.poster)
    );

    const response: SearchResponse = {
      shows: validResults,
      totalResults: Number(imdbResults.totalResults),
      currentPage: Number(page),
      totalPages: Math.ceil(Number(imdbResults.totalResults) / 10),
    };

    // Cache results
    cacheService.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      message: 'Failed to search shows',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

export const getShowDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch show details from a service or database
    // This is a placeholder implementation
    const showDetails = await fetchShowDetailsFromService(id);

    if (!showDetails) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json(showDetails);
  } catch (error) {
    console.error('Error fetching show details:', error);
    res.status(500).json({
      message: 'Failed to fetch show details',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Placeholder function to simulate fetching show details
async function fetchShowDetailsFromService(id: string) {
  // Simulate fetching data
  return {
    id,
    title: 'Sample Show',
    description: 'This is a sample show description.',
    rating: 8.5,
  };
} 
