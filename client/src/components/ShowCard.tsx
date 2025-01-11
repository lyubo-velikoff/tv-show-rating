import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import RatingWithLogo from './RatingWithLogo';
import { Show } from '../types/show';

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative pt-[150%]">
        <img
          src={show.poster}
          alt={show.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm ${
            isFavorite ? 'text-red-500' : 'text-white'
          } hover:text-red-500`}
        >
          <HeartIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div>
          <a
            href={`https://www.imdb.com/title/${show.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
          >
            {show.title}
          </a>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {show.year}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {show.description}
        </p>
        <div className="mt-auto pt-4 space-y-2">
          <RatingWithLogo
            source="IMDb"
            rating={show.rating}
            url={`https://www.imdb.com/title/${show.id}`}
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
    </div>
  );
};

export default React.memo(ShowCard); 
