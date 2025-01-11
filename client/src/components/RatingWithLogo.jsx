import PropTypes from 'prop-types';
import imdbLogo from '../assets/images/imdb-logo.js';
import vikiLogo from '../assets/images/viki-logo.js';

const LOGOS = {
  IMDb: imdbLogo,
  Viki: vikiLogo,
};

export default function RatingWithLogo({ source, rating, url }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src={LOGOS[source]}
          alt={`${source} logo`}
          className={`w-10 h-10 object-contain ${
            source === 'IMDb' ? 'dark:brightness-[1.75] dark:contrast-[1.25]' : ''
          }`}
        />
        {url && rating > 0 ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm ${
              rating > 0
                ? 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 cursor-default'
            }`}
          >
            {source}
          </a>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {source}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {rating > 0 ? rating.toFixed(1) : 'N/A'}/10
      </span>
    </div>
  );
}

RatingWithLogo.propTypes = {
  source: PropTypes.oneOf(['IMDb', 'Viki']).isRequired,
  rating: PropTypes.number,
  url: PropTypes.string,
}; 
