import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Show } from '../types/show';
import imdbLogo from '../assets/images/imdb.webp'
import vikiLogo from '../assets/images/viki.png';
import mdlLogo from '../assets/images/mydramalist.png';

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
    <div className="relative overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 min-h-[700px]"> {/* Set minimum height */}
      <img
        src={show.poster}
        alt={show.title}
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div> {/* Gradient overlay */}
      <div className="absolute bottom-0 w-full p-4 text-white bg-black bg-opacity-50"> {/* Stick content to bottom */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 p-1 rounded-full bg-black/50 backdrop-blur-sm ${
            isFavorite ? 'text-red-500' : 'text-white'
          } hover:text-red-500`}
        >
          <HeartIcon className="w-5 h-5" />
        </button>
        <a
          href={`https://www.imdb.com/title/${show.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-md hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
        >
          {show.title}
        </a>
        <div className="text-xs text-gray-300">
          {show.year}
        </div>
        <p className="mt-1 text-xs line-clamp-3">
          {show.description}
        </p>
        <div className="flex mt-2 space-x-4"> {/* Display ratings on the same line */}
          <a href={`https://www.imdb.com/title/${show.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
            <img src={imdbLogo} alt="IMDb" className="w-7 h-7" />
            <span className="text-m">{show.rating}/10</span>
          </a>
          <a href={show.vikiHref || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
            <img src={vikiLogo} alt="Viki" className="w-7 h-7" />
            <span className="text-m">{show.vikiRating}/10</span>
          </a>
          <a href={show.mdlHref || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
            <img src={mdlLogo} alt="MDL" className="w-7 h-7" />
            <span className="text-m">{show.mdlRating}/10</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
