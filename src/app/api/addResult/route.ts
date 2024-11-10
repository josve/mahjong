import {NextRequest, NextResponse} from 'next/server';
import Connection from '@/lib/connection';
import {PoolConnection} from "mysql2/promise";
import { auth } from "@/auth";

async function getNewRoundIndex(connection: PoolConnection, matchId: string) {
  const [latestRoundResult]: any = await connection.query(
      'SELECT MAX(ROUND) as latestRound FROM Hands WHERE GAME_ID = ?',
      [matchId]
  );
  const latestRound = latestRoundResult[0]?.latestRound || 0;
  return latestRound + 1;
}

function calculateHandScore(teamIds: string[], i: number, scores: any, hand: any, teamId: string, eastTeam: string, winner: string) {
  let handScore = 0;
  // Calculate the hand score based on the difference with other players
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
  return handScore;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { scores, eastTeam, winner, matchId } = body;

  if (process.env.REQUIRE_LOGIN) {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
  }

  const windOrder = ['E', 'N', 'W', 'S'];

  const connection = await Connection.getInstance().getConnection();
  try {
    const teamIds = Object.keys(scores);
    const eastIndex = teamIds.indexOf(eastTeam);
    const newRound = await getNewRoundIndex(connection, matchId);

    for (let i = 0; i < teamIds.length; i++) {
      const teamId = teamIds[i];
      const hand = scores[teamId];
      let handScore = calculateHandScore(teamIds, i, scores, hand, teamId, eastTeam, winner);
      const wind = windOrder[(i - eastIndex + 4) % 4];
      
      await connection.query(
        'INSERT INTO Hands (GAME_ID, TEAM_ID, HAND, HAND_SCORE, IS_WINNER, WIND, ROUND, TIME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [matchId, teamId, hand, handScore, teamId === winner, wind, newRound, new Date()]
      );
    }
    return NextResponse.json({ message: 'Results added successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add results' }, { status: 500 });
  } finally {
    connection.release();
  }
}
