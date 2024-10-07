import { NextRequest, NextResponse } from 'next/server';
import Connection from '@/lib/connection';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received request:', body);
  const { scores, eastTeam, winner, matchId } = body;

  const windOrder = ['E', 'N', 'W', 'S'];

  const connection = await Connection.getInstance().getConnection();
  try {
    const teamIds = Object.keys(scores);
    const eastIndex = teamIds.indexOf(eastTeam);

    const [latestRoundResult] = await connection.query(
      'SELECT MAX(ROUND) as latestRound FROM Hands WHERE GAME_ID = ?',
      [matchId]
    );
    const latestRound = latestRoundResult[0]?.latestRound || 0;
    const newRound = latestRound + 1;

    for (let i = 0; i < teamIds.length; i++) {
      const teamId = teamIds[i];
      const score = scores[teamId];
      const wind = windOrder[(i - eastIndex + 4) % 4];

      console.log(`Inserting result for team ${teamId}: score=${score}, wind=${wind}, isWinner=${teamId === winner}`);

      await connection.query(
        'INSERT INTO Hands (GAME_ID, TEAM_ID, HAND_SCORE, IS_WINNER, WIND, ROUND) VALUES (?, ?, ?, ?, ?, ?)',
        [matchId, teamId, score, teamId === winner, wind, newRound]
      );
    }
    console.log('Results added successfully');
    return NextResponse.json({ message: 'Results added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding results:', error);
    return NextResponse.json({ error: 'Failed to add results' }, { status: 500 });
  } finally {
    connection.release();
  }
}
