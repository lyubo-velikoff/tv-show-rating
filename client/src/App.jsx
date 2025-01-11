import React from 'react';
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import ShowGrid from './components/ShowGrid';
import Pagination from './components/Pagination';
import { searchShows } from './services/api.js';

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSearch, setCurrentSearch] = useState('');

  const handleSearch = async (query, pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchShows(query, pageNum);
      setShows(results.shows);
      setTotalPages(results.totalPages);
      setCurrentSearch(query);
    } catch (error) {
      setError(error);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (currentSearch) {
      handleSearch(currentSearch, newPage);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-center py-20">
        <h1 className="text-red-500 text-xl">Error: {error.message}</h1>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <SearchBar 
            onSearch={(query) => {
              setPage(1);
              handleSearch(query, 1);
            }}
            setLoading={setLoading}
            setError={setError}
          />
          <ShowGrid shows={shows} loading={loading} />
          {shows.length > 0 && (
            <Pagination 
              page={page} 
              setPage={handlePageChange} 
              totalPages={totalPages} 
            />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 
