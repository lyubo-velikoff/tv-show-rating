import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const BASE_URL = 'https://mydramalist.com';

export async function searchMyDramaList(query) {
  try {
    const cacheKey = `mdl_search_${query}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const shows = [];

    $('.box').each((_, element) => {
      const $element = $(element);
      const title = $element.find('h6 a').text().trim();
      const url = BASE_URL + $element.find('h6 a').attr('href');
      const poster = $element.find('img').attr('src');
      const rating = parseFloat($element.find('.score').text()) || 0;
      const year =
        $element.find('.text-muted').text().match(/\d{4}/)?.[0] || '';

      if (title && url) {
        shows.push({
          title,
          url,
          poster,
          rating,
          year,
          source: 'MyDramaList',
        });
      }
    });

    cache.set(cacheKey, shows);
    return shows;
  } catch (error) {
    console.error('MyDramaList scraping error:', error);
    return [];
  }
}

export async function getShowDetails(url) {
  try {
    const cacheKey = `mdl_details_${url}`;
    const cachedResult = cache.get(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    const details = {
      title: $('h1.film-title').text().trim(),
      nativeName: $('.show-native-title').text().trim(),
      poster: $('.film-cover img').attr('src'),
      rating: parseFloat($('.score').first().text()) || 0,
      synopsis: $('.show-synopsis').text().trim(),
      genres: $('.show-genres a')
        .map((_, el) => $(el).text().trim())
        .get(),
      cast: $('.cast-credits li')
        .map((_, el) => ({
          name: $(el).find('.text-primary').text().trim(),
          role: $(el).find('.text-muted').text().trim(),
        }))
        .get(),
      aired: $('.show-air-date').text().trim(),
      status: $('.show-status').text().trim(),
    };

    cache.set(cacheKey, details);
    return details;
  } catch (error) {
    console.error('MyDramaList details scraping error:', error);
    return null;
  }
}
