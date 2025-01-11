import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

interface MDLShow {
  title: string;
  mdlId: string;
  rating: number;
  source: 'MDL';
  href: string;
}

export async function searchMDL(query: string): Promise<MDLShow[]> {
  try {
    console.log('🔍 Searching MDL for:', query);
    const cacheKey = `mdl_search_${query}`;
    const cachedResult = cache.get<MDLShow[]>(cacheKey);

    if (cachedResult) {
      console.log('✅ Found cached MDL results for:', query);
      return cachedResult;
    }

    // Search MDL
    const searchUrl = `https://mydramalist.com/search?q=${encodeURIComponent(query)}`;
    console.log('📡 MDL Search URL:', searchUrl);

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const shows: MDLShow[] = [];

    // Find all show entries in search results
    $('.box-body').each((_, element) => {
      const $element = $(element);
      const title = $element.find('h6.text-primary a').text().trim();
      const href = $element.find('h6.text-primary a').attr('href');
      const mdlId = href?.match(/\/(\d+)/)?.[1];
      const ratingText = $element.find('.score').text().trim();
      const rating = parseFloat(ratingText) || 0;

      console.log('🔍 Found MDL show:', {
        title,
        href,
        mdlId,
        ratingText,
        rating,
      });

      if (title && mdlId) {
        shows.push({
          title,
          mdlId,
          rating,
          source: 'MDL',
          href: href?.startsWith('http')
            ? href
            : `https://mydramalist.com${href}`,
        });
      }
    });

    const showsWithDetails = shows.map((show) => ({
      ...show,
      source: 'MDL' as const,
    }));

    console.log('✅ MDL search results:', {
      query,
      resultsCount: showsWithDetails.length,
      shows: showsWithDetails,
    });

    cache.set(cacheKey, showsWithDetails);
    return showsWithDetails;
  } catch (error) {
    console.error('❌ MDL API error:', {
      query,
      error: (error as Error).message,
      status: (error as any).response?.status,
    });
    return [];
  }
} 
