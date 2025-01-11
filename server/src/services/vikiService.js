import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const VIKI_API_URL = 'https://api.viki.io/v4';
const VIKI_TOKEN = process.env.VIKI_TOKEN;

if (!VIKI_TOKEN) {
  throw new Error('VIKI_TOKEN is not defined in environment variables');
}

export async function searchViki(query) {
  try {
    console.log('🔍 Searching Viki for:', query);
    const cacheKey = `viki_search_${query}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
      console.log('✅ Found cached Viki results for:', query);
      return cachedResult;
    }

    // Use Viki API
    const searchUrl = `${VIKI_API_URL}/search.json`;
    console.log('📡 Viki Search URL:', searchUrl);

    const response = await axios.get(searchUrl, {
      params: {
        term: query,
        with_paging: true,
        page: 1,
        per_page: 24,
        blocked: true,
        with_people: true,
        il: 'en',
        cl: 'en',
        token: VIKI_TOKEN,
        app: '100000a',
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en',
        'content-type': 'application/json',
        Referer: 'https://www.viki.com/',
      },
    });

    const shows = [];

    // Process API response
    response.data.response.forEach((show) => {
      if (show.type === 'series') {
        shows.push({
          title: show.titles.en,
          vikiId: show.id,
          poster: show.images?.poster?.url,
          rating: show.review_stats?.average_rating || 0,
          source: 'Viki',
        });
      }
    });

    console.log('📺 Found Viki shows:', shows);

    console.log('✅ Viki search results:', {
      query,
      resultsCount: shows.length,
      shows,
    });

    cache.set(cacheKey, shows);
    return shows;
  } catch (error) {
    console.error('❌ Viki scraping error:', {
      query,
      error: error.message,
      status: error.response?.status,
    });
    return [];
  }
}
