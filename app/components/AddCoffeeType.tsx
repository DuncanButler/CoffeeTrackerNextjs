import React, { useState } from 'react';

interface AddCoffeeTypeProps {
  onAdd: (newType: { name: string; description: string }) => void;
}

export default function AddCoffeeType({ onAdd }: AddCoffeeTypeProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    try {
      const response = await fetch('/api/coffee-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add coffee type');
      }
      
      const newType = await response.json();
      onAdd(newType);
      
      // Reset form
      setName('');
      setDescription('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add coffee type:', error);
      alert('Failed to add coffee type. Please try again.');
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
      >
        Add New Coffee Type
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-amber-200 rounded-md bg-amber-50">
      <h3 className="text-lg font-semibold mb-3">Add New Coffee Type</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="typeName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="typeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="typeDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="typeDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
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
