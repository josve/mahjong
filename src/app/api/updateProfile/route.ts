import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import Connection from '@/lib/connection';

export async function POST(req: NextRequest) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { color_red, color_green, color_blue, show_previous_round_score } = await req.json();
  const playerId = session.user.playerId;

  const connection = await Connection.getInstance().getConnection();
  try {
    await connection.query(
      `UPDATE Players SET COLOR_RED = ?, COLOR_GREEN = ?, COLOR_BLUE = ?, SHOW_PREVIOUS_ROUND_SCORE = ? WHERE PLAYER_ID = ?`,
      [color_red, color_green, color_blue, show_previous_round_score, playerId]
    );
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  } finally {
    connection.release();
  }
}
