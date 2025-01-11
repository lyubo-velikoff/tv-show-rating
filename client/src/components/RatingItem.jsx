import PropTypes from 'prop-types';

export default function RatingItem({ source, rating, url }) {
  return (
    <div className="flex justify-between items-center">
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
        <span className="text-sm text-gray-400 dark:text-gray-500">{source}</span>
      )}
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {rating > 0 ? rating.toFixed(1) : 'N/A'}/10
      </span>
    </div>
  );
}

RatingItem.propTypes = {
  source: PropTypes.string.isRequired,
  rating: PropTypes.number,
  url: PropTypes.string,
}; 
