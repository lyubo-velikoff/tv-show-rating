import { Link } from 'react-router-dom';

const FavoritesButton = () => {
  return (
    <Link
      to="/favorites"
      className="fixed bottom-16 right-4 z-50 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
      title="View Favorites"
    >
      <span className="text-2xl">❤️</span>
    </Link>
  );
};

export default FavoritesButton; 
