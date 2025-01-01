import { NextRequest, NextResponse } from 'next/server';
import {
  getTeamIdToName,
  getTeamIdToPlayerIds,
  fetchAllTeamsAndPlayers,
  getTeamAndPlayerColors
} from '@/lib/dbMatch';
import fetchMatches from '@/lib/fetchMatches';
import {StatisticsResponse} from "@/types/api";

export async function GET(_req: NextRequest) {
  try {
    const teamIdToName = await getTeamIdToName();
    const teamIdToPlayerIds = await getTeamIdToPlayerIds();
    const matches = await fetchMatches();
    const allTeamsAndPlayers = await fetchAllTeamsAndPlayers();
    const teamAndPlayerColors = await getTeamAndPlayerColors();

    const data: StatisticsResponse = {
      allTeamsAndPlayers,
      teamIdToName,
      teamIdToPlayerIds,
      teamAndPlayerColors,
      matches
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics data:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics data' }, { status: 500 });
  }
}
