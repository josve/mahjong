import { NextRequest, NextResponse } from 'next/server';
import Connection from '@/lib/connection';
import { auth } from "@/auth";
import {UpdateResultResponse} from "@/types/api";

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { matchId, scores, round, eastTeam, winner } = body;

  if (process.env.REQUIRE_LOGIN) {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
  }

  const connection = await Connection.getInstance().getConnection();
  const windOrder = ['E', 'N', 'W', 'S'];

  try {
    const teamIds = Object.keys(scores);

    await Promise.all(teamIds.map(async (teamId, i) => {
      let handScore = 0;
      const hand = scores[teamId];
      const eastIndex = teamIds.indexOf(eastTeam);

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

      const wind = windOrder[(i - eastIndex + 4) % 4];

      await connection.query(
        "UPDATE Hands SET HAND = ?, HAND_SCORE = ?, IS_WINNER = ?, WIND = ?  WHERE GAME_ID = ? AND ROUND = ? AND TEAM_ID = ?",
        [hand, handScore, teamId === winner, wind, matchId, round, teamId]
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
