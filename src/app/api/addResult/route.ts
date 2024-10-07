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
      let handScore = 0;
      const hand = scores[teamId];

      // Calculate the hand score based on the difference with other players
      for (let j = 0; j < teamIds.length; j++) {
        if (i !== j) {
          const otherHand = scores[teamIds[j]];
          let difference = hand - otherHand;
          if (teamId === eastTeam || teamIds[j] === eastTeam) {
            difference *= 2;
          }
          handScore += difference < 0 ? 0 : difference;
        }
      }
      const wind = windOrder[(i - eastIndex + 4) % 4];

      console.log(`Inserting result for team ${teamId}: handScore=${handScore}, wind=${wind}, isWinner=${teamId === winner}`);

      await connection.query(
        'INSERT INTO Hands (GAME_ID, TEAM_ID, HAND_SCORE, IS_WINNER, WIND, ROUND, TIME) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [matchId, teamId, handScore, teamId === winner, wind, newRound, new Date()]
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
