import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Show } from '../types/show';
import { getFavorites } from '../services/api';
import ShowGrid from './ShowGrid';
import LoadingSpinner from './LoadingSpinner';

const FavoritesPage = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoriteShows = await getFavorites();
        setShows(favoriteShows);
        setFavorites(favoriteShows.map(show => show.id));
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError(err instanceof Error ? err.message : 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link 
          to="/"
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
      </nav>
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : shows.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>No favorite shows yet.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Start searching to add some!
          </Link>
        </div>
      ) : (
        <ShowGrid 
          shows={shows} 
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}
    </div>
  );
};

export default FavoritesPage; 
