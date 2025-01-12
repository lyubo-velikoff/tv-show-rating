import { Show } from '../types/show';
import ShowCard from './ShowCard';

interface ShowGridProps {
  shows: Show[];
}

const ShowGrid = ({ shows }: ShowGridProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
};

export default ShowGrid; 
