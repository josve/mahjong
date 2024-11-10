import { NextResponse } from 'next/server';
import { getTeamDetails } from '@/lib/dbMatch';
import {TeamsResponse} from "@/types/api";

export async function GET() {
  try {
    const teamDetails = await getTeamDetails();
    const teams: TeamsResponse[]
     = Object.entries(teamDetails).map(([id, details]) => ({
      id,
      name: details.teamName,
      concatenatedName: details.concatenatedName,
      playerIds: details.playerIds
    }));
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
