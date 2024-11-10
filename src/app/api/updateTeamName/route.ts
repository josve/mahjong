import { NextRequest, NextResponse } from 'next/server';
import Connection from '@/lib/connection';
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { teamId, teamName } = await req.json();
  const playerId = session.user.playerId;

  if (!playerId) {
    return NextResponse.json({ error: 'Incorrect playerId' }, { status: 500 });
  }

  const connection = await Connection.getInstance().getConnection();
  try {
    const [rows]: any = await connection.query(
      `SELECT * FROM Teams WHERE TEAM_ID = ? AND PLAYER_ID = ?`,
      [teamId, playerId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User is not part of the team' }, { status: 403 });
    }

    if (teamName === "") {
      await connection.query(
        `DELETE FROM TeamAttributes WHERE TEAM_ID = ? AND ATTRIBUTE = 'alias'`,
        [teamId]
      );
    } else {
      await connection.query(
        `INSERT INTO TeamAttributes (TEAM_ID, ATTRIBUTE, VALUE) VALUES (?, 'alias', ?)
         ON DUPLICATE KEY UPDATE VALUE = VALUES(VALUE)`,
        [teamId, teamName]
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating team name:', error);
    return NextResponse.json({ error: 'Failed to update team name' }, { status: 500 });
  } finally {
    connection.release();
  }
}
