import { NextRequest, NextResponse } from 'next/server';
import Connection from '@/lib/connection';

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { matchId, scores, round } = body;

  try {
    const connection = await Connection.getInstance().getConnection();

    const [eastTeamResult] = await connection.query(
      "SELECT TEAM_ID as EAST_TEAM FROM Hands WHERE GAME_ID = ? AND ROUND = ? AND WIND = 'E' LIMIT 1",
      [matchId, req.body.round]
    );

    const eastTeam = eastTeamResult[0]?.EAST_TEAM;

    const [winnerResult] = await connection.query(
      "SELECT TEAM_ID as WINNER FROM Hands WHERE GAME_ID = ? AND ROUND = ? AND IS_WINNER = TRUE LIMIT 1",
      [matchId, req.body.round]
    );
    const winner = winnerResult[0]?.WINNER || null;

    const teamIds = Object.keys(scores);
    const eastIndex = teamIds.indexOf(eastTeam);

    await Promise.all(teamIds.map(async (teamId, i) => {
      let handScore = 0;
      const hand = scores[teamId];

      for (let j = 0; j < teamIds.length; j++) {
        if (i !== j) {
          const otherHand = scores[teamIds[j]];
          let difference = hand - otherHand;
          if (teamId === eastTeam || teamIds[j] === eastTeam) {
            difference *= 2;
          }
          if (teamId === winner) {
            handScore += difference < 0 ? 0 : difference;
          } else {
            handScore += difference;
          }
        }
      }

      await connection.query(
        "UPDATE Hands SET HAND = ?, HAND_SCORE = ? WHERE GAME_ID = ? AND ROUND = ? AND TEAM_ID = ?",
        [hand, handScore, matchId, req.body.round, teamId]
      );
    }));

    return NextResponse.json({ message: 'Result updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating result:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
