import { useState } from 'react';
import { Show } from './types/show';
import SearchBar from './components/SearchBar';
import ShowGrid from './components/ShowGrid';
import { ThemeToggle } from './components/ThemeToggle';

const App = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage] = useState(1);

  const handleSearchResults = (results: { shows: Show[]; currentPage: number; totalPages: number }) => {
    setShows(results.shows);
  };

  return (
    <div className="min-h-screen text-gray-900 bg-white transition-colors duration-200 dark:bg-gray-900 dark:text-white">
      <div className="container px-4 py-8 mx-auto">
        <SearchBar
          onSearchResults={handleSearchResults}
          onError={setError}
          onLoading={setLoading}
          currentPage={currentPage}
        />
        {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        <ShowGrid shows={shows} loading={loading} />
      </div>
      <ThemeToggle />
    </div>
  );
};

export default App; 
