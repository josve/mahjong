import { NextRequest, NextResponse } from 'next/server';
import { getHandsByGameId, getTeamIdToName, getTeamColors } from '@/lib/dbMatch';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'matchId is required' }, { status: 400 });
  }

  try {
    const hands = await getHandsByGameId(matchId);
    const teamIdToName = await getTeamIdToName();
    const teamColors = await getTeamColors();

    const data = {
      hands,
      teamIdToName,
      teamColors,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching match chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch match chart data' }, { status: 500 });
  }
}
