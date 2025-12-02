
import { approveRental } from '@/lib/services/rentalService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { rentalId, ownerId } = await req.json();
  const result = await approveRental(rentalId, ownerId);
  return NextResponse.json(result);
}
