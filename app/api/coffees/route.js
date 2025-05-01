import { NextResponse } from 'next/server';
import { getCoffeesWithRelations, saveCoffee, getCoffeeTypes, getCoffeeShops } from '@/lib/data';
import { validateCoffee } from '@/lib/validation';

// GET /api/coffees - get all coffees
export async function GET() {
  try {
    const coffees = getCoffeesWithRelations();
    // Sort by consumedAt, newest first
    coffees.sort((a, b) => new Date(b.consumedAt) - new Date(a.consumedAt));
    
    return NextResponse.json(coffees);
  } catch (error) {
    console.error('Error fetching coffees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffees' },
      { status: 500 }
    );
  }
}

// POST /api/coffees - create a new coffee entry
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
      const validatedData = validateCoffee(body);
      
      // Check if coffee type and shop exist
      const types = getCoffeeTypes();
      const type = types.find(t => t.id === validatedData.typeId);
      
      if (!type) {
        return NextResponse.json(
          { error: 'Coffee type not found' },
          { status: 404 }
        );
      }
      
      const shops = getCoffeeShops();
      const shop = shops.find(s => s.id === validatedData.shopId);
      
      if (!shop) {
        return NextResponse.json(
          { error: 'Coffee shop not found' },
          { status: 404 }
        );
      }
        // Create coffee entry using file-based storage
      const coffee = saveCoffee(validatedData);
      
      return NextResponse.json(coffee, { status: 201 });
    } catch (error) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error creating coffee entry:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee entry' },
      { status: 500 }
    );
  }
}
