import {NextRequest, NextResponse} from 'next/server';
import Connection from '@/lib/connection';
import {PoolConnection} from "mysql2/promise";
import { auth } from "@/auth";
import {generateRoundComment} from "@/lib/openai";

async function getLatestRound(connection: PoolConnection, matchId: string) {
    const [latestRoundResult]: any = await connection.query(
        'SELECT MAX(ROUND) as latestRound FROM Hands WHERE GAME_ID = ?',
        [matchId]
    );
    return latestRoundResult[0]?.latestRound || 0;
}


export async function POST(req: NextRequest) {
    const body = await req.json();
    const {matchId} = body;

    const session = await auth();

    if (!session || !session.user) {
      //  return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const connection = await Connection.getInstance().getConnection();
    try {
        const newRound = await getLatestRound(connection, matchId);

        const comment = await generateRoundComment(matchId, newRound);

        const data: any = {comment: comment};
        return NextResponse.json(data, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Failed to generate comment'}, {status: 500});
    } finally {
        connection.release();
    }
}
