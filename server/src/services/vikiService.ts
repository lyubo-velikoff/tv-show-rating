import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const VIKI_API_URL = 'https://api.viki.io/v4';
const VIKI_TOKEN = process.env.VIKI_TOKEN;

if (!VIKI_TOKEN) {
  throw new Error('VIKI_TOKEN is not defined in environment variables');
}

export interface VikiShow {
  id: string;
  title: string;
  rating: number;
  href?: string;
}

export async function searchViki(query: string): Promise<VikiShow[]> {
  try {
    console.log('🔍 Searching Viki API for:', query);
    const cacheKey = `viki_search_${query}`;
    const cachedResult = cache.get<VikiShow[]>(cacheKey);

    if (cachedResult) {
      console.log('✅ Found cached Viki API results for:', query);
      return cachedResult;
    }

    const searchUrl = `${VIKI_API_URL}/search.json`;
    console.log('📡 Viki API Request:', {
      url: searchUrl,
      term: query,
    });

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

    const shows = response.data.response
      .filter((show: any) => show.type === 'series')
      .map((show: any) => ({
        title: show.titles.en,
        vikiId: show.id.toString(),
        rating: show.review_stats?.average_rating || 0,
        href: `https://www.viki.com/tv/${show.id}v`,
      }));

    console.log('✅ Viki API results:', {
      query,
      resultsCount: shows.length,
      shows,
    });

    cache.set(cacheKey, shows);
    return shows;
  } catch (error) {
    console.error('❌ Viki API error:', {
      query,
      error: (error as Error).message,
      status: (error as any).response?.status,
    });
    return [];
  }
} 
