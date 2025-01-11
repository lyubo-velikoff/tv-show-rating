import React from 'react';
import ShowCard from './ShowCard';
import LoadingSpinner from './LoadingSpinner';

export default function ShowGrid({ shows, loading }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
} 
