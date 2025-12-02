
import { searchBooks } from '@/lib/services/bookService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }
  const result = await searchBooks(query);
  return NextResponse.json(result);
}
