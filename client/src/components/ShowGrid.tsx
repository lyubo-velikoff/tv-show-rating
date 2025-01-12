import { Show } from '../types/show';
import ShowCard from './ShowCard';

interface ShowGridProps {
  shows: Show[];
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
}

const ShowGrid = ({ shows, favorites, setFavorites }: ShowGridProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {shows.map((show) => (
        <ShowCard 
          key={show.id} 
          show={show} 
          isFavorite={favorites.includes(show.id)}
          onFavoriteChange={(isFavorite) => {
            if (isFavorite) {
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
