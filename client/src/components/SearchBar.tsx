import React, { useCallback, useEffect, useState } from 'react';
import { searchShows } from '../services/api';

interface SearchBarProps {
  onSearchResults: (results: any) => void;
  onLoading: (loading: boolean) => void;
  currentPage: number;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults, onLoading, currentPage, onError }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      onSearchResults({ shows: [], currentPage: 1, totalPages: 0 });
      return;
    }
    
    onLoading(true);
    try {
      const results = await searchShows(debouncedQuery, currentPage);
      onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      onError(error instanceof Error ? error.message : 'An error occurred while searching');
    } finally {
      onLoading(false);
    }
  }, [debouncedQuery, currentPage, onSearchResults, onLoading, onError]);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    handleSearch();
  }, [debouncedQuery, currentPage]); // Remove handleSearch from dependencies

  return (
    <div className="mx-auto mb-8 w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for TV shows..."
        className="px-4 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar; 
