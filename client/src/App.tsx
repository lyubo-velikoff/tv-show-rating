import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { Show } from './types/show';
import { searchShows, getFavorites, addToFavorites, removeFromFavorites } from './services/api';
import SearchBar from './components/SearchBar';
import ShowGrid from './components/ShowGrid';
import ShowDetails from './components/ShowDetails';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import { ThemeToggle } from './components/ThemeToggle';
import FavoritesButton from './components/FavoritesButton';
import FavoritesPage from './components/FavoritesPage';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    getFavorites()
      .then(favShows => {
        setFavorites(favShows.map(show => show.id));
      })
      .catch(error => {
        console.error('Error fetching favorites:', error);
      });
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setShows([]);
        setTotalPages(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await searchShows(query, currentPage);
        setShows(response.shows);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('Error searching shows:', err);
        setError(err instanceof Error ? err.message : 'Failed to search shows');
        setShows([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, currentPage]);

  const handleSearch = useCallback((newQuery: string) => {
    if (newQuery.trim() === '') {
      setSearchParams({});
    } else {
      setSearchParams({ q: newQuery, page: '1' });
    }
  }, [setSearchParams]);

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
  }, [query, setSearchParams]);

  const handleFavoriteChange = async (show: Show, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await addToFavorites(show);
        setFavorites(prev => [...prev, show.id]);
      } else {
        await removeFromFavorites(show.id);
        setFavorites(prev => prev.filter(id => id !== show.id));
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
      // Revert the optimistic update
      if (isFavorite) {
        setFavorites(prev => prev.filter(id => id !== show.id));
      } else {
        setFavorites(prev => [...prev, show.id]);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar onSearch={handleSearch} initialQuery={query} />
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ShowGrid 
            shows={shows} 
            favorites={favorites}
            setFavorites={(newFavorites) => {
              const added = newFavorites.find(id => !favorites.includes(id));
              const removed = favorites.find(id => !newFavorites.includes(id));
              
              if (added) {
                const show = shows.find(s => s.id === added);
                if (show) handleFavoriteChange(show, true);
              } else if (removed) {
                const show = shows.find(s => s.id === removed);
                if (show) handleFavoriteChange(show, false);
              }
            }}
          />
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
        <FavoritesButton />
        <ThemeToggle />
      </div>
    </BrowserRouter>
  );
};

export default App; 
