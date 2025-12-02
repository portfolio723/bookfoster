
import { claimDonation } from '@/lib/services/donationService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { donationId, recipientId } = await req.json();
  const result = await claimDonation(donationId, recipientId);
  return NextResponse.json(result);
}
