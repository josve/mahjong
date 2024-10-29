import { NextRequest, NextResponse } from 'next/server';
import { deleteGameById } from '@/lib/dbMatch';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'matchId is required' }, { status: 400 });
  }

  try {
    await deleteGameById(matchId);
    return NextResponse.json({ message: 'Game deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
