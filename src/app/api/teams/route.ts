import { NextResponse } from 'next/server';
import { getTeamIdToName } from '@/lib/dbMatch';

export async function GET() {
  try {
    const teamIdToName = await getTeamIdToName();
    const teams = Object.entries(teamIdToName).map(([id, name]) => ({ id, name }));
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
