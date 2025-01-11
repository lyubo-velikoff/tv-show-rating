import { Request, Response } from 'express';
import { searchIMDb } from '../services/apiServices';
import { searchViki, VikiShow } from '../services/vikiService';
import { searchMDL, MDLShow } from '../services/mdlService';
import { cacheService } from '../services/cacheService';
import { SearchResponse, Show } from '../types/show';

// Add helper function for title normalization
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Add helper function for title similarity
function isExactMatch(normalized1: string, normalized2: string): boolean {
  return normalized1 === normalized2;
}

function isSubstring(normalized1: string, normalized2: string): boolean {
  return normalized1.includes(normalized2) || normalized2.includes(normalized1);
}

function calculateWordSimilarity(normalized1: string, normalized2: string): number {
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.min(words1.length, words2.length);
}

function areTitlesSimilar(title1: string, title2: string): boolean {
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);

  return isExactMatch(normalized1, normalized2) ||
         isSubstring(normalized1, normalized2) ||
         calculateWordSimilarity(normalized1, normalized2) > 0.5;
}

function findMatchingVikiShow(sourceShow: Show, vikiShows: VikiShow[]): VikiShow | undefined {
  return vikiShows.find(show => areTitlesSimilar(show.title, sourceShow.title));
}

function findMatchingMDLShow(sourceShow: Show, mdlShows: MDLShow[]): MDLShow | undefined {
  return mdlShows.find(show => areTitlesSimilar(show.title, sourceShow.title));
}

function enrichShowWithRatings(imdbShow: Show, vikiShow?: VikiShow, mdlShow?: MDLShow): Show {
  return {
    ...imdbShow,
    vikiRating: vikiShow?.rating || 0,
    vikiId: vikiShow?.id ? vikiShow.id.toString() : null,
    vikiHref: vikiShow?.href || null,
    mdlRating: mdlShow?.rating || 0,
    mdlId: mdlShow?.id || null,
    mdlHref: mdlShow?.href || null,
  };
}

export const searchShows = async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;

    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Query parameter must be a string' });
    }

    const cacheKey = `${query}_page${page}`;
    const cachedResults = cacheService.get<SearchResponse>(cacheKey);
    if (cachedResults) {
      return res.json(cachedResults);
    }

    const [imdbResults, vikiResults, mdlResults] = await Promise.all([
      searchIMDb(query, Number(page)),
      searchViki(query),
      searchMDL(query),
    ]);

    const combinedShows = imdbResults.shows.map(imdbShow => {
      const vikiShow = findMatchingVikiShow(imdbShow, vikiResults);
      const mdlShow = findMatchingMDLShow(imdbShow, mdlResults);
      return enrichShowWithRatings(imdbShow, vikiShow, mdlShow);
    });

    const response: SearchResponse = {
      shows: combinedShows,
      totalResults: imdbResults.totalResults,
      currentPage: Number(page),
      totalPages: Math.ceil(imdbResults.totalResults / 10),
    };

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
