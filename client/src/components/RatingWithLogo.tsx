import vikiLogo from '../assets/images/viki.png';
import imdbLogo from '../assets/images/imdb.webp';
import mdlLogo from '../assets/images/mydramalist.png';

interface RatingWithLogoProps {
  source: 'IMDb' | 'Viki' | 'MDL';
  rating?: number;
  url?: string;
}

const RatingWithLogo = ({ source, rating, url }: RatingWithLogoProps) => {
  const getLogo = () => {
    switch (source) {
      case 'IMDb':
        return imdbLogo;
      case 'Viki':
        return vikiLogo;
      case 'MDL':
        return mdlLogo;
    }
  };

  const getAlt = () => {
    switch (source) {
      case 'IMDb':
        return 'IMDb Rating';
      case 'Viki':
        return 'Viki Rating';
      case 'MDL':
        return 'MyDramaList Rating';
    }
  };

  const Content = () => (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
      <img src={getLogo()} alt={getAlt()} className="h-6 object-contain" />
      <span className="font-semibold">
        {rating ? `${rating.toFixed(1)}/10` : 'N/A'}
      </span>
    </div>
  );

  if (url && rating && rating > 0) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity duration-200"
        title={`View on ${source}`}
      >
        <Content />
      </a>
    );
  }

  return <Content />;
};

export default RatingWithLogo; 
