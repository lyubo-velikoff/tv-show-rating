import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export interface MDLShow {
  id: string;
  title: string;
  rating: number;
  href: string;
}

function parseShowFromElement($: cheerio.CheerioAPI, element: any): MDLShow | null {
  const $element = $(element);
  const title = $element.find('h6.text-primary a').text().trim();
  const href = $element.find('h6.text-primary a').attr('href');
  const mdlId = href?.match(/\/(\d+)/)?.[1];
  const rating = parseFloat($element.find('.score').text().trim()) || 0;

  if (!title || !mdlId) return null;

  return {
    id: mdlId,
    title,
    rating,
    href: href?.startsWith('http') ? href : `https://mydramalist.com${href}`,
  };
}

export async function searchMDL(query: string): Promise<MDLShow[]> {
  try {
    const cacheKey = `mdl_search_${query}`;
    const cachedResult = cache.get<MDLShow[]>(cacheKey);
    if (cachedResult) return cachedResult;

    const response = await axios.get(
      `https://mydramalist.com/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      }
    );

    const $ = cheerio.load(response.data);
    const shows = $('.box-body')
      .map((_, element) => parseShowFromElement($, element))
      .get()
      .filter((show): show is MDLShow => show !== null);

    cache.set(cacheKey, shows);
    return shows;
  } catch (error) {
    console.error('MDL API error:', error);
    return [];
  }
} 
