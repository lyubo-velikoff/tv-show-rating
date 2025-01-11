import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com';

console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  OMDB_API_KEY: process.env.OMDB_API_KEY,
});

if (!OMDB_API_KEY) {
  throw new Error('OMDB_API_KEY is not defined in environment variables');
}

export async function searchIMDb(query, page = 1) {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${query}&type=series&page=${page}`;
    console.log('OMDB Search Request URL:', url);

    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: query,
        type: 'series',
        page: page,
      },
    });

    console.log('OMDB Search Response:', {
      totalResults: response.data.totalResults,
      resultsCount: response.data.Search?.length || 0,
      firstResult: response.data.Search?.[0],
    });

    if (response.data.Response === 'False') {
      console.error('OMDB API error:', response.data.Error);
      return { shows: [], totalResults: 0 };
    }

    if (!response.data.Search) {
      return { shows: [], totalResults: 0 };
    }

    // Fetch detailed information for each show to get ratings
    const showsWithDetails = await Promise.all(
      response.data.Search.map(async (show) => {
        const details = await getIMDbDetails(show.imdbID);
        return {
          id: show.imdbID,
          title: show.Title,
          description: details?.description || show.Type,
          poster: show.Poster !== 'N/A' ? show.Poster : null,
          year: show.Year,
          rating: details?.rating || 0,
          source: 'IMDb',
        };
      })
    );

    return {
      shows: showsWithDetails,
      totalResults: parseInt(response.data.totalResults),
    };
  } catch (error) {
    console.error('IMDb API error:', error);
    return { shows: [], totalResults: 0 };
  }
}

// Get detailed information including rating
export async function getIMDbDetails(imdbId) {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`;
    console.log('OMDB Details Request URL:', url);

    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId,
        plot: 'full',
      },
    });

    console.log('OMDB Details Response:', {
      title: response.data.Title,
      rating: response.data.imdbRating,
      year: response.data.Year,
    });

    if (response.data.Response === 'False') {
      return null;
    }

    return {
      id: response.data.imdbID,
      title: response.data.Title,
      description: response.data.Plot,
      poster: response.data.Poster !== 'N/A' ? response.data.Poster : null,
      year: response.data.Year,
      rating: parseFloat(response.data.imdbRating) || 0,
      votes: parseInt(response.data.imdbVotes.replace(/,/g, ''), 10),
      genres: response.data.Genre.split(', '),
      runtime: response.data.Runtime,
      released: response.data.Released,
      source: 'IMDb',
    };
  } catch (error) {
    console.error('IMDb details API error:', error);
    return null;
  }
}
