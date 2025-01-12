import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Show } from '../types/show';
import { getShowDetails } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import RatingWithLogo from './RatingWithLogo';

const ShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const searchPage = searchParams.get('page');
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const details = await getShowDetails(id);
        setShow(details);
      } catch (err) {
        console.error('Error fetching show details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch show details');
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  const backToSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchPage) params.set('page', searchPage);
    return `/?${params.toString()}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!show) {
    return <div className="text-center">Show not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link 
          to={backToSearch()} 
          className="inline-flex items-center space-x-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 group"
        >
          <svg 
            className="w-5 h-5 transform transition-transform duration-200 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          <span className="text-lg">Back to Search</span>
        </Link>
        <div className="mt-2 flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Link to={backToSearch()} className="hover:text-blue-600 dark:hover:text-blue-400">
            {searchQuery ? `Search: "${searchQuery}"` : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{show.title}</span>
        </div>
      </nav>
      <div className="flex flex-col md:flex-row gap-8">
        {show.poster && (
          <div className="w-full md:w-1/3">
            <img
              src={show.poster}
              alt={show.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{show.title}</h1>
          {show.year && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">Year: {show.year}</p>
          )}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ratings</h2>
            <div className="flex flex-wrap gap-4">
              <RatingWithLogo 
                source="IMDb" 
                rating={show.rating} 
                url={show.imdbHref || undefined}
              />
              <RatingWithLogo 
                source="Viki" 
                rating={show.vikiRating} 
                url={show.vikiHref || undefined} 
              />
              <RatingWithLogo 
                source="MDL" 
                rating={show.mdlRating} 
                url={show.mdlHref || undefined} 
              />
            </div>
          </div>
          {show.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300">{show.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowDetails; 
