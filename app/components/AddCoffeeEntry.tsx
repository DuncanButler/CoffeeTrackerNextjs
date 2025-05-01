import React, { useState } from 'react';
import { CoffeeType, CoffeeShop } from '@/types/coffee';
import { useForm } from 'react-hook-form';

interface AddCoffeeEntryProps {
  coffeeTypes: CoffeeType[];
  coffeeShops: CoffeeShop[];
  onAdd: (newCoffee: any) => void;
}

interface FormData {
  typeId: string;
  shopId: string;
  notes?: string;
  rating?: string;
}

export default function AddCoffeeEntry({ coffeeTypes, coffeeShops, onAdd }: AddCoffeeEntryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const coffeeEntry = {
        typeId: parseInt(data.typeId),
        shopId: parseInt(data.shopId),
        notes: data.notes || '',
        rating: data.rating ? parseInt(data.rating) : 0,
        consumedAt: new Date().toISOString(),
      };
      
      const response = await fetch('/api/coffees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coffeeEntry),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add coffee entry');
      }
      
      const newCoffee = await response.json();
      onAdd(newCoffee);
      
      // Reset form
      reset();
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add coffee entry:', error);
      alert('Failed to add coffee entry. Please try again.');
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
      >
        Add New Coffee Entry
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-amber-200 rounded-md bg-amber-50">
      <h3 className="text-lg font-semibold mb-3">Add New Coffee Entry</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="coffeeType" className="block text-sm font-medium text-gray-700 mb-1">
            Coffee Type
          </label>
          <select
            id="coffeeType"
            {...register('typeId', { required: 'Coffee type is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select a coffee type</option>
            {coffeeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.typeId && <p className="mt-1 text-sm text-red-600">{errors.typeId.message}</p>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="coffeeShop" className="block text-sm font-medium text-gray-700 mb-1">
            Coffee Shop
          </label>
          <select
            id="coffeeShop"
            {...register('shopId', { required: 'Coffee shop is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select a coffee shop</option>
            {coffeeShops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} {shop.location ? `(${shop.location})` : ''}
              </option>
            ))}
          </select>
          {errors.shopId && <p className="mt-1 text-sm text-red-600">{errors.shopId.message}</p>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="coffeeNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="coffeeNotes"
            {...register('notes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="coffeeRating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating (1-5)
          </label>
          <select
            id="coffeeRating"
            {...register('rating')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="0">No rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
