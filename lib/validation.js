// filepath: c:\Users\dunca\source\learning\FunWithJo\coffee-tracker\lib\validation.js
/**
 * Sanitizes and validates input for coffee shop
 * @param {Object} data - The input data to sanitize and validate
 * @returns {Object} - The sanitized data
 */
export function validateCoffeeShop(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  
  // Validate name (required)
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Name is required');
  }
  
  // Sanitize name
  const name = data.name.trim().slice(0, 100); // Limit name length
  
  // Sanitize location (optional)
  const location = data.location && typeof data.location === 'string' 
    ? data.location.trim().slice(0, 200) 
    : null;
    
  return { name, location };
}

/**
 * Sanitizes and validates input for coffee type
 * @param {Object} data - The input data to sanitize and validate
 * @returns {Object} - The sanitized data
 */
export function validateCoffeeType(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  
  // Validate name (required)
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error('Name is required');
  }
  
  // Sanitize name
  const name = data.name.trim().slice(0, 100); // Limit name length
  
  // Sanitize description (optional)
  const description = data.description && typeof data.description === 'string' 
    ? data.description.trim().slice(0, 500) 
    : null;
    
  return { name, description };
}

/**
 * Sanitizes and validates input for coffee entry
 * @param {Object} data - The input data to sanitize and validate
 * @returns {Object} - The sanitized data
 */
export function validateCoffee(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  
  // Validate typeId (required)
  if (!data.typeId || isNaN(Number(data.typeId))) {
    throw new Error('Valid coffee type is required');
  }
  
  // Validate shopId (required)
  if (!data.shopId || isNaN(Number(data.shopId))) {
    throw new Error('Valid coffee shop is required');
  }
  
  // Sanitize notes (optional)
  const notes = data.notes && typeof data.notes === 'string' 
    ? data.notes.trim().slice(0, 1000) 
    : null;
  
  // Sanitize rating (optional)
  const rating = data.rating !== undefined ? 
    Math.min(Math.max(0, Number(data.rating) || 0), 5) : 0;
    
  // Validate and sanitize consumedAt (optional)
  let consumedAt = null;
  if (data.consumedAt) {
    try {
      const date = new Date(data.consumedAt);
      if (!isNaN(date.getTime())) {
        consumedAt = date.toISOString();
      }
    } catch (e) {
      // If invalid date, use current date (handled by default)
    }
  }
  
  return { 
    typeId: Number(data.typeId), 
    shopId: Number(data.shopId),
    notes,
    rating,
    consumedAt: consumedAt || new Date().toISOString()
  };
}
