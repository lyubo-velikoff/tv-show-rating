import { searchIMDb } from '../services/apiServices.js';
import { cacheService } from '../services/cacheService.js';

export const searchShows = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const cacheKey = `${query}_page${page}`;

    // Check cache first
    const cachedResults = cacheService.get(cacheKey);
    if (cachedResults) {
      return res.json(cachedResults);
    }

    // Fetch IMDb results with pagination
    const results = await searchIMDb(query, parseInt(page));

    // Filter out results with missing posters or titles
    const validResults = results.shows.filter(
      (show) => show.title && show.poster
    );

    const response = {
      shows: validResults,
      totalResults: results.totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(results.totalResults / 10), // OMDB returns 10 results per page
    };

    // Cache results
    cacheService.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      message: 'Failed to search shows',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getShowDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement show details fetching
    res.json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get show details' });
  }
};
