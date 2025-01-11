import { useState, useCallback } from 'react';
import { searchShows } from '../services/api';
import { Show } from '../types/show';

interface SearchBarProps {
  onSearchResults: (data: { 
    shows: Show[]; 
    currentPage: number; 
    totalPages: number; 
  }) => void;
  onError: (error: string) => void;
  onLoading: (isLoading: boolean) => void;
  currentPage: number;
}

export default function SearchBar({ 
  onSearchResults, 
  onError, 
  onLoading,
  currentPage,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      onError('Please enter a search term');
      return;
    }

    try {
      onLoading(true);
      const response = await searchShows(query, currentPage);
      onSearchResults(response);
    } catch (error) {
      console.error('Search error:', error);
      onError('Failed to search shows. Please try again.');
    } finally {
      onLoading(false);
    }
  }, [query, currentPage, onSearchResults, onError, onLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search TV shows..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        Search
      </button>
    </form>
  );
} 
