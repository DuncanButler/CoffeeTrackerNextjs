"use client";

import { useState, useEffect } from 'react';
import AddCoffeeShop from './components/AddCoffeeShop';

function Page() {
  const [activeTab, setActiveTab] = useState('journal');
  const [coffeeTypes, setCoffeeTypes] = useState([]);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [coffees, setCoffees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    // Form states
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [newCoffeeType, setNewCoffeeType] = useState('');
  const [newCoffeeShop, setNewCoffeeShop] = useState('');
  const [newCoffeeNotes, setNewCoffeeNotes] = useState('');
  const [newCoffeeRating, setNewCoffeeRating] = useState(0);  // Fetch coffee types, shops, and entries when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [typesRes, shopsRes, coffeesRes] = await Promise.all([
          fetch('/api/coffee-types'),
          fetch('/api/coffee-shops'),
          fetch('/api/coffees'),
        ]);

        // Process each response individually to handle any errors
        let types = [], shops = [], coffeeData = [];
        
        if (typesRes.ok) {
          types = await typesRes.json();
        } else {
          console.error('Failed to fetch coffee types');
          // Use mock data as fallback
          types = [
            { id: 1, name: 'Espresso', description: 'Strong coffee brewed by forcing hot water through finely-ground coffee beans' },
            { id: 2, name: 'Cappuccino', description: 'Espresso with steamed milk foam' },
            { id: 3, name: 'Latte', description: 'Espresso with steamed milk' },
            { id: 4, name: 'Americano', description: 'Espresso with hot water' }
          ];
        }
        
        if (shopsRes.ok) {
          shops = await shopsRes.json();
        } else {
          console.error('Failed to fetch coffee shops');
          // Use mock data as fallback
          shops = [
            { id: 1, name: 'Coffee Haven', location: 'Downtown' },
            { id: 2, name: 'Beans & Brew', location: 'Westside Mall' },
            { id: 3, name: 'Morning Brew', location: 'East Village' }
          ];
        }
        
        if (coffeesRes.ok) {
          coffeeData = await coffeesRes.json();
        } else {
          console.error('Failed to fetch coffees');
          // Use mock data as fallback
          coffeeData = [
            { 
              id: 1, 
              consumedAt: new Date().toISOString(), 
              typeId: 1, 
              shopId: 1,
              notes: 'Really enjoyed this one!', 
              rating: 5,
              type: types.find(t => t.id === 1) || types[0],
              shop: shops.find(s => s.id === 1) || shops[0]
            },
            { 
              id: 2, 
              consumedAt: new Date(Date.now() - 86400000).toISOString(), 
              typeId: 2, 
              shopId: 3, 
              notes: 'Good but a bit too hot', 
              rating: 3,
              type: types.find(t => t.id === 2) || types[1],
              shop: shops.find(s => s.id === 3) || shops[2]
            }
          ];
        }

        setCoffeeTypes(types);
        setCoffeeShops(shops);
        setCoffees(coffeeData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // Handle adding a new coffee type
  const handleAddCoffeeType = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    
    try {
      const response = await fetch('/api/coffee-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTypeName,
          description: newTypeDesc,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add coffee type');
      }
      
      const newType = await response.json();
      setCoffeeTypes([...coffeeTypes, newType]);
      
      // Reset form
      setNewTypeName('');
      setNewTypeDesc('');
    } catch (err) {
      console.error('Error adding coffee type:', err);
      alert('Failed to add coffee type. Please try again.');
    }
  };
    // Coffee shop addition is now handled by the AddCoffeeShop component
  
  // Handle adding a new coffee entry
  const handleAddCoffee = async (e) => {
    e.preventDefault();
    if (!newCoffeeType || !newCoffeeShop) return;
    
    try {
      const response = await fetch('/api/coffees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeId: parseInt(newCoffeeType),
          shopId: parseInt(newCoffeeShop),
          notes: newCoffeeNotes,
          rating: parseInt(newCoffeeRating),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add coffee entry');
      }
      
      const newCoffee = await response.json();
      setCoffees([newCoffee, ...coffees]);
      
      // Reset form
      setNewCoffeeType('');
      setNewCoffeeShop('');
      setNewCoffeeNotes('');
      setNewCoffeeRating(0);
      
      // Switch to journal tab to show the new entry
      setActiveTab('journal');
    } catch (err) {
      console.error('Error adding coffee entry:', err);
      alert('Failed to add coffee entry. Please try again.');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-amber-700 flex items-center">
          <div className="w-16 h-16 border-4 border-current border-solid rounded-full border-r-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-amber-800">Loading your coffee tracker...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-amber-900 flex items-center justify-center gap-2">
          <span>Coffee Tracker</span>
          <span className="text-2xl">☕</span>
        </h1>
        <p className="text-gray-600 mt-2">Keep track of your daily coffee consumption</p>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'journal'
              ? 'text-amber-700 border-b-2 border-amber-500'
              : 'text-gray-500 hover:text-amber-700'
          }`}
          onClick={() => setActiveTab('journal')}
        >
          Coffee Journal
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'add'
              ? 'text-amber-700 border-b-2 border-amber-500'
              : 'text-gray-500 hover:text-amber-700'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add New Entry
        </button>
      </div>

      {/* Content area */}
      <div className="mt-6">
        {activeTab === 'journal' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Coffee Journal</h2>
            {coffees.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {coffees.map(coffee => (
                  <div key={coffee.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                    <h3 className="font-medium text-amber-800">{coffee?.type?.name || 'Unknown Coffee'}</h3>
                    <p className="text-gray-500">From: {coffee?.shop?.name || 'Unknown Shop'}</p>
                    {coffee.notes && <p className="mt-2 italic">"{coffee.notes}"</p>}
                    {coffee.rating > 0 && (
                      <div className="mt-1">
                        {Array(5).fill('★').map((star, i) => (
                          <span 
                            key={i}
                            className={i < coffee.rating ? 'text-amber-500' : 'text-gray-300'}
                          >
                            {star}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
                No coffee entries yet. Add your first coffee!
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add a New Coffee</h2>
            
            {/* Add Coffee Entry Form */}
            <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-lg font-medium mb-4 text-amber-800">Track a Coffee</h3>
              <form onSubmit={handleAddCoffee}>
                <div className="grid gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coffee Type</label>
                    <select
                      value={newCoffeeType}
                      onChange={(e) => setNewCoffeeType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a type</option>
                      {coffeeTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coffee Shop</label>
                    <select
                      value={newCoffeeShop}
                      onChange={(e) => setNewCoffeeShop(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a shop</option>
                      {coffeeShops.map(shop => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newCoffeeNotes}
                    onChange={(e) => setNewCoffeeNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    value={newCoffeeRating}
                    onChange={(e) => setNewCoffeeRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="0">No rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  disabled={!newCoffeeType || !newCoffeeShop}
                >
                  Add Coffee Entry
                </button>
              </form>
            </div>
            
            {/* Add Coffee Type Form */}
            <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-lg font-medium mb-4 text-amber-800">Add New Coffee Type</h3>
              <form onSubmit={handleAddCoffeeType}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea
                    value={newTypeDesc}
                    onChange={(e) => setNewTypeDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  disabled={!newTypeName.trim()}
                >
                  Add Coffee Type
                </button>
              </form>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Current Coffee Types:</h4>
                <ul className="list-disc pl-5">
                  {coffeeTypes.length > 0 ? (
                    coffeeTypes.map(type => (
                      <li key={type.id}>{type.name}</li>
                    ))
                  ) : (
                    <li className="text-gray-500">No coffee types yet</li>
                  )}
                </ul>
              </div>
            </div>
              {/* Add Coffee Shop Form */}
            <div className="p-6 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-lg font-medium mb-4 text-amber-800">Add New Coffee Shop</h3>
              <AddCoffeeShop onAdd={(newShop) => {
                setCoffeeShops([...coffeeShops, newShop]);
              }} />
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Current Coffee Shops:</h4>
                <ul className="list-disc pl-5">
                  {coffeeShops.length > 0 ? (
                    coffeeShops.map(shop => (
                      <li key={shop.id}>
                        {shop.name}
                        {shop.location && <span className="text-gray-500"> ({shop.location})</span>}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No coffee shops yet</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coffee count summary */}
      <div className="mt-8 p-4 bg-amber-100 rounded-lg text-center">
        <p className="text-amber-900">
          <span className="font-bold">{coffees.length}</span> coffee{coffees.length !== 1 ? 's' : ''} tracked so far
        </p>
      </div>
    </div>
  );
}

export default Page;
