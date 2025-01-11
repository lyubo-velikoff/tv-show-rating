import { searchIMDb } from '../services/apiServices.js';
import { searchViki } from '../services/vikiService.js';
import { searchMDL } from '../services/mdlService.js';
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

    // Fetch results from all sources
    const [imdbResults, vikiResults, mdlResults] = await Promise.all([
      searchIMDb(query, parseInt(page)),
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
      (show) => show.title && show.poster
    );

    const response = {
      shows: validResults,
      totalResults: imdbResults.totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(imdbResults.totalResults / 10),
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
