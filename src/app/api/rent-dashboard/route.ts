import { NextResponse } from 'next/server';

// Mock data - replace with actual database calls
const rentData = {
  totalRentDue: 5000,
  rentCollected: 3500,
  projectedRentCollection: 60000,
  monthlyRentData: [
    { month: 'Jan', projected: 5000, collected: 4800 },
    { month: 'Feb', projected: 5000, collected: 5000 },
    { month: 'Mar', projected: 5000, collected: 4700 },
    // ... add more months
  ]
};

export async function GET() {
  return NextResponse.json(rentData);
}