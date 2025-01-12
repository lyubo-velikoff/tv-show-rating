import { Link, useSearchParams } from 'react-router-dom';
import { Show } from '../types/show';

interface ShowCardProps {
  show: Show;
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

const ShowCard = ({ show, isFavorite, onFavoriteChange }: ShowCardProps) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const searchPage = searchParams.get('page');

  const detailsLink = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchPage) params.set('page', searchPage);
    return `/show/${show.id}?${params.toString()}`;
  };

  return (
    <div className="relative group">
      <Link to={detailsLink()}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          {show.poster ? (
            <img
              src={show.poster}
              alt={show.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-semibold truncate">{show.title}</h3>
            {show.year && (
              <p className="text-sm text-gray-300">{show.year}</p>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onFavoriteChange(!isFavorite);
        }}
        className="absolute top-2 right-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 p-2 hover:scale-110 transform"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default ShowCard;
