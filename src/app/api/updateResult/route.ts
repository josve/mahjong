import { NextRequest, NextResponse } from 'next/server';
import Connection from '@/lib/connection';
import { auth } from "@/auth";
import {UpdateResultResponse} from "@/types/api";

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { matchId, scores, round } = body;

  if (process.env.REQUIRE_LOGIN) {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
  }

  const connection = await Connection.getInstance().getConnection();

  try {
    const [eastTeamResult]: any = await connection.query(
      "SELECT TEAM_ID as EAST_TEAM FROM Hands WHERE GAME_ID = ? AND ROUND = ? AND WIND = 'E' LIMIT 1",
      [matchId, round]
    );

    const eastTeam = eastTeamResult[0]?.EAST_TEAM;

    const [winnerResult]: any = await connection.query(
      "SELECT TEAM_ID as WINNER FROM Hands WHERE GAME_ID = ? AND ROUND = ? AND IS_WINNER = TRUE LIMIT 1",
      [matchId, round]
    );
    const winner = winnerResult[0]?.WINNER || null;

    const teamIds = Object.keys(scores);

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
        [hand, handScore, matchId, round, teamId]
      );
    }));

    const data: UpdateResultResponse = { message: 'Result updated successfully' };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error updating result:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    connection.release();
  }
}
