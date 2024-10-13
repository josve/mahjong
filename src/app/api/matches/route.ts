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
      'INSERT INTO Games (NAME, COMMENT, TIME, TEAM_ID_1, TEAM_ID_2, TEAM_ID_3, TEAM_ID_4, IS_TEST) VALUES (?, ?, NOW(), ?, ?, ?, ?, 0)',
      [matchName, matchDescription, ...teamIds, ...Array(4 - teamIds.length).fill(null)]
    );
    const gameId = (gameResult as any).insertId;

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
