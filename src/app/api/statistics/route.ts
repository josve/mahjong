import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayers, getTeamIdToName, getTeamIdToPlayerIds, getPlayerColors } from '@/lib/dbMatch';
import fetchMatches from '@/lib/fetchMatches';

export async function GET(req: NextRequest) {
  try {
    const allPlayers = await getAllPlayers();
    const teamIdToName = await getTeamIdToName();
    const teamIdToPlayerIds = await getTeamIdToPlayerIds();
    const playerColors = await getPlayerColors();
    const matches = await fetchMatches();

    const data = {
      allPlayers,
      teamIdToName,
      teamIdToPlayerIds,
      playerColors,
      matches
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics data:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics data' }, { status: 500 });
  }
}
