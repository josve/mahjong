import { NextResponse } from 'next/server';
import Connection from '@/lib/connection';

export async function POST(request: Request) {
  const { teamIds, matchName, matchDescription } = await request.json();

  const connection = await Connection.getInstance().getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert into Games table
    const [gameResult] = await connection.query(
      'INSERT INTO Games (NAME, DESCRIPTION, TIME) VALUES (?, ?, NOW())',
      [matchName, matchDescription]
    );
    const gameId = (gameResult as any).insertId;

    // Insert into GameTeams table
    for (const teamId of teamIds) {
      await connection.query(
        'INSERT INTO GameTeams (GAME_ID, TEAM_ID) VALUES (?, ?)',
        [gameId, teamId]
      );
    }

    // Commit the transaction
    await connection.commit();

    return NextResponse.json({ success: true, gameId });
  } catch (error) {
    // If an error occurs, rollback the transaction
    await connection.rollback();
    console.error('Error creating match:', error);
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  } finally {
    connection.release();
  }
}
