import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ShowCard from './components/ShowCard';
import Navbar from './components/Navbar';
import Pagination from './components/Pagination';
import { Show } from './types/show';

export default function App() {
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearchResults = (data: { 
    shows: Show[]; 
    currentPage: number; 
    totalPages: number; 
  }) => {
    setShows(data.shows);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SearchBar
          onSearchResults={handleSearchResults}
          onError={setError}
          onLoading={setIsLoading}
          currentPage={currentPage}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo(0, 0);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 
