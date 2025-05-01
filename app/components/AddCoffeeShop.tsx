import React, { useState } from 'react';

interface AddCoffeeShopProps {
  onAdd: (newShop: { name: string; location: string }) => void;
}

export default function AddCoffeeShop({ onAdd }: AddCoffeeShopProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    try {
      const response = await fetch('/api/coffee-shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          location,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add coffee shop');
      }
      
      const newShop = await response.json();
      onAdd(newShop);
      
      // Reset form
      setName('');
      setLocation('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add coffee shop:', error);
      alert('Failed to add coffee shop. Please try again.');
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
      >
        Add New Coffee Shop
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-amber-200 rounded-md bg-amber-50">
      <h3 className="text-lg font-semibold mb-3">Add New Coffee Shop</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="shopName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="shopLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Location (optional)
          </label>
          <input
            type="text"
            id="shopLocation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
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
