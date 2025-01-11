import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function ShowCard({ show }) {
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {show.title}
          </h3>
          <button
            onClick={toggleFavorite}
            className={`${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500`}
          >
            <HeartIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {show.description}
        </p>
        <div className="mt-4 space-y-2">
          <RatingItem source="IMDb" rating={show.rating} />
        </div>
      </div>
    </div>
  );
}

function RatingItem({ source, rating }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">{source}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {rating > 0 ? rating.toFixed(1) : 'N/A'}/10
      </span>
    </div>
  );
}

ShowCard.propTypes = {
  show: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    poster: PropTypes.string,
    rating: PropTypes.number,
    year: PropTypes.string,
  }).isRequired,
};

RatingItem.propTypes = {
  source: PropTypes.string.isRequired,
  rating: PropTypes.number,
}; 
