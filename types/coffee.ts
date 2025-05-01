// Types based on our Prisma schema
export interface CoffeeType {
  id: number;
  name: string;
  description?: string;
}

export interface CoffeeShop {
  id: number;
  name: string;
  location?: string;
}

export interface Coffee {
  id: number;
  consumedAt: Date;
  typeId: number;
  type?: CoffeeType;
  shopId: number;
  shop?: CoffeeShop;
  notes?: string;
  rating?: number;
}

export interface CoffeeFormData {
  typeId: number;
  shopId: number;
  notes?: string;
  rating?: number;
  consumedAt?: Date;
}
