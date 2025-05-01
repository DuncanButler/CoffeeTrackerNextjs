import React from 'react';
import { Coffee } from '@/types/coffee';
import { formatDistance } from 'date-fns';

interface CoffeeListProps {
  coffees: Coffee[];
}

export default function CoffeeList({ coffees }: CoffeeListProps) {
  if (coffees.length === 0) {
    return (
      <div className="mt-8 text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-500">No coffee entries yet. Add your first coffee!</p>
      </div>
    );
  }

  const renderRating = (rating: number | undefined) => {
    if (!rating) return 'Not rated';
    
    return Array(5)
      .fill('★')
      .map((star, i) => (
        <span
          key={i}
          className={`text-lg ${i < rating ? 'text-amber-500' : 'text-gray-300'}`}
        >
          {star}
        </span>
      ));
  };

  const formatDate = (date: Date) => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Coffee Journal</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {coffees.map((coffee) => (
          <div 
            key={coffee.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-amber-900">
                {coffee.type?.name}
              </h3>
              <span className="text-sm text-gray-500">
                {formatDate(coffee.consumedAt)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              <span className="font-medium">From:</span> {coffee.shop?.name}
              {coffee.shop?.location && ` (${coffee.shop.location})`}
            </p>
            {coffee.notes && (
              <p className="mt-2 text-gray-700 italic">"{coffee.notes}"</p>
            )}
            <div className="mt-3 flex items-center">
              <span className="mr-2 text-sm text-gray-500">Rating:</span>
              <div>{renderRating(coffee.rating)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
