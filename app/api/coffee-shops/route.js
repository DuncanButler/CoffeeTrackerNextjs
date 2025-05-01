import { NextResponse } from 'next/server';
import { getCoffeeShops, saveCoffeeShop } from '@/lib/data';
import { validateCoffeeShop } from '@/lib/validation';

// GET /api/coffee-shops - get all coffee shops
export async function GET() {
  try {
    const coffeeShops = getCoffeeShops();
    return NextResponse.json(coffeeShops);
  } catch (error) {
    console.error('Error fetching coffee shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee shops' },
      { status: 500 }
    );
  }
}

// POST /api/coffee-shops - create a new coffee shop
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
      const validatedData = validateCoffeeShop(body);
      
      // Create coffee shop using file-based data store
      const coffeeShop = saveCoffeeShop(validatedData);
      
      return NextResponse.json(coffeeShop, { status: 201 });
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating coffee shop:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee shop' },
      { status: 500 }
    );
  }
}
