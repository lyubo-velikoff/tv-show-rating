import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Show } from '../types/show';
import imdbLogo from '../assets/images/imdb.webp';
import vikiLogo from '../assets/images/viki.png';
import mdlLogo from '../assets/images/mydramalist.png';
import { addFavorite, removeFavorite } from '../services/api';

interface ShowCardProps {
  show: Show;
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

const ShowCard: React.FC<ShowCardProps> = ({ show, isFavorite, onFavoriteChange }) => {
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(show.id);
        onFavoriteChange(false);
      } else {
        await addFavorite(show);
        onFavoriteChange(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 min-h-[700px] transform transition-transform duration-300 hover:scale-105">
      <img
        src={show.poster}
        alt={show.title}
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute bottom-0 w-full p-4 text-white bg-black bg-opacity-50">
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
        <div className="flex mt-2 space-x-2">
          <a href={`https://www.imdb.com/title/${show.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
            <img src={imdbLogo} alt="IMDb" className="w-10 h-10" />
            <span className="text-xs">{show.rating}/10</span>
          </a>
          <a href={show.vikiHref || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
            <img src={vikiLogo} alt="Viki" className="w-10 h-10" />
            <span className="text-xs">{show.vikiRating}/10</span>
          </a>
          <a href={show.mdlHref || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
            <img src={mdlLogo} alt="MDL" className="w-10 h-10" />
            <span className="text-xs">{show.mdlRating}/10</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
