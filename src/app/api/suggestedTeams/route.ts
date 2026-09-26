import { NextResponse } from 'next/server';
import { getTeamDetails } from '@/lib/dbMatch';
import { getAllMatches } from '@/lib/fetchMatches';
import { suggestTeams } from '@/lib/teamSuggestion';
import {SuggestedTeamsResponse} from "@/types/api";

export async function GET() {
  try {
    const [matches, teamDetails] = await Promise.all([getAllMatches(), getTeamDetails()]);
    const data: SuggestedTeamsResponse = { teamIds: suggestTeams(matches, teamDetails) };
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error suggesting teams:', error);
    return NextResponse.json({ error: 'Failed to suggest teams' }, { status: 500 });
  }
}
