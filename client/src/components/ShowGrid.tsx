import React from 'react';
import ShowCard from './ShowCard';
import LoadingSpinner from './LoadingSpinner';
import { Show } from '../types/show';

interface ShowGridProps {
  shows: Show[];
  loading: boolean;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
}

const ShowGrid: React.FC<ShowGridProps> = ({ shows, loading, favorites, setFavorites }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shows.map((show) => (
        <ShowCard 
          key={show.id} 
          show={show} 
          isFavorite={favorites.includes(show.id)}
          onFavoriteChange={(isFav) => {
            if (isFav) {
              setFavorites([...favorites, show.id]);
            } else {
              setFavorites(favorites.filter(id => id !== show.id));
            }
          }}
        />
      ))}
    </div>
  );
};

export default ShowGrid; 
