import { NextRequest, NextResponse } from 'next/server';
import {getHandsByGameId, getTeamIdToName, getTeamColors, getMatchById} from '@/lib/dbMatch';

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
    const match = await getMatchById(matchId);

    // Calculate standard deviation of hand scores
    const handScores = hands.map(hand => hand.HAND_SCORE);
    const mean = handScores.reduce((acc, score) => acc + score, 0) / handScores.length;
    const squaredDifferences = handScores.map(score => Math.pow(score - mean, 2));
    const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / squaredDifferences.length;
    const standardDeviation = Math.sqrt(variance);

    const data = {
      hands,
      teamIdToName,
      teamColors,
      match,
      standardDeviation
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching match chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch match chart data' }, { status: 500 });
  }
}
