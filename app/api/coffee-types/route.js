import { NextResponse } from 'next/server';
import { getCoffeeTypes, saveCoffeeType } from '@/lib/data';
import { validateCoffeeType } from '@/lib/validation';

// GET /api/coffee-types - get all coffee types
export async function GET() {
  try {
    const coffeeTypes = getCoffeeTypes();
    return NextResponse.json(coffeeTypes);
  } catch (error) {
    console.error('Error fetching coffee types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee types' },
      { status: 500 }
    );
  }
}

// POST /api/coffee-types - create a new coffee type
export async function POST(request) {
  try {
    if (!request || !request.json) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    try {
      // Sanitize and validate input
      const validatedData = validateCoffeeType(body);
      
      // Check if coffee type already exists (case insensitive)
      const existingTypes = getCoffeeTypes();
      if (existingTypes.find(type => 
        type.name.toLowerCase() === validatedData.name.toLowerCase())) {
        return NextResponse.json(
          { error: 'Coffee type already exists' },
          { status: 400 }
        );
      }
        
      // Create coffee type using file-based storage
      const coffeeType = saveCoffeeType(validatedData);
        
      return NextResponse.json(coffeeType, { status: 201 });
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating coffee type:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee type' },
      { status: 500 }
    );
  }
}
