import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PropTypes from 'prop-types';
import RatingItem from './RatingItem';

export default function ShowCard({ show }) {
  console.log('📺 Show data:', {
    title: show.title,
    vikiRating: show.vikiRating,
    vikiId: show.vikiId,
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorites functionality with localStorage
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img
        src={show.poster}
        alt={show.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <a
              href={`https://www.imdb.com/title/${show.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              {show.title}
            </a>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {show.year}
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            className={`${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 ml-4`}
          >
            <HeartIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {show.description}
        </p>
        <div className="mt-4 space-y-2">
          <RatingItem
            source="IMDb"
            rating={show.rating}
            url={`https://www.imdb.com/title/${show.id}`}
          />
          <RatingItem
            source="Viki"
            rating={show.vikiRating}
            url={show.vikiId ? `https://www.viki.com/tv/${show.vikiId}` : undefined}
          />
        </div>
      </div>
    </div>
  );
}

ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    poster: PropTypes.string,
    rating: PropTypes.number,
    vikiRating: PropTypes.number,
    vikiId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year: PropTypes.string,
  }).isRequired,
};

RatingItem.propTypes = {
  source: PropTypes.string.isRequired,
  rating: PropTypes.number,
  url: PropTypes.string
}; 
