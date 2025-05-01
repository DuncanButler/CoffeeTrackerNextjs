import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths
const COFFEE_TYPES_FILE = path.join(DATA_DIR, 'coffee-types.json');
const COFFEE_SHOPS_FILE = path.join(DATA_DIR, 'coffee-shops.json');
const COFFEES_FILE = path.join(DATA_DIR, 'coffees.json');

// Initialize files if they don't exist
const initializeFile = (filePath, initialData = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error(`Error initializing file ${filePath}:`, error);
    throw error;
  }
};

initializeFile(COFFEE_TYPES_FILE);
initializeFile(COFFEE_SHOPS_FILE);
initializeFile(COFFEES_FILE);

// Helper functions for coffee types
export const getCoffeeTypes = () => {
  const data = fs.readFileSync(COFFEE_TYPES_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveCoffeeType = (coffeeType) => {
  try {
    const coffeeTypes = getCoffeeTypes();
    const newId = coffeeTypes.length > 0 ? Math.max(...coffeeTypes.map(t => t.id)) + 1 : 1;
    
    const newCoffeeType = {
      id: newId,
      name: coffeeType.name,
      description: coffeeType.description || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    coffeeTypes.push(newCoffeeType);
    fs.writeFileSync(COFFEE_TYPES_FILE, JSON.stringify(coffeeTypes, null, 2));
    
    return newCoffeeType;
  } catch (error) {
    console.error('Error in saveCoffeeType:', error);
    throw error;
  }
};

// Helper functions for coffee shops
export const getCoffeeShops = () => {
  const data = fs.readFileSync(COFFEE_SHOPS_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveCoffeeShop = (coffeeShop) => {
  const coffeeShops = getCoffeeShops();
  const newId = coffeeShops.length > 0 ? Math.max(...coffeeShops.map(s => s.id)) + 1 : 1;
  
  const newCoffeeShop = {
    id: newId,
    name: coffeeShop.name,
    location: coffeeShop.location || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  coffeeShops.push(newCoffeeShop);
  fs.writeFileSync(COFFEE_SHOPS_FILE, JSON.stringify(coffeeShops, null, 2));
  
  return newCoffeeShop;
};

// Helper functions for coffees
export const getCoffees = () => {
  const data = fs.readFileSync(COFFEES_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveCoffee = (coffee) => {
  const coffees = getCoffees();
  const coffeeTypes = getCoffeeTypes();
  const coffeeShops = getCoffeeShops();
  
  // Validate coffee type and shop existence
  const coffeeType = coffeeTypes.find(t => t.id === coffee.typeId);
  if (!coffeeType) {
    throw new Error('Coffee type not found');
  }
  
  const coffeeShop = coffeeShops.find(s => s.id === coffee.shopId);
  if (!coffeeShop) {
    throw new Error('Coffee shop not found');
  }
  
  const newId = coffees.length > 0 ? Math.max(...coffees.map(c => c.id)) + 1 : 1;
  
  const newCoffee = {
    id: newId,
    typeId: coffee.typeId,
    shopId: coffee.shopId,
    consumedAt: coffee.consumedAt || new Date().toISOString(),
    notes: coffee.notes || null,
    rating: coffee.rating || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  coffees.push(newCoffee);
  fs.writeFileSync(COFFEES_FILE, JSON.stringify(coffees, null, 2));
  
  // Return with type and shop data included
  return {
    ...newCoffee,
    type: coffeeType,
    shop: coffeeShop,
  };
};

// Get coffee with related type and shop data
export const getCoffeesWithRelations = () => {
  const coffees = getCoffees();
  const coffeeTypes = getCoffeeTypes();
  const coffeeShops = getCoffeeShops();
  
  return coffees.map(coffee => ({
    ...coffee,
    type: coffeeTypes.find(t => t.id === coffee.typeId),
    shop: coffeeShops.find(s => s.id === coffee.shopId),
  }));
};
