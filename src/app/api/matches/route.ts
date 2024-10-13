import { NextResponse } from 'next/server';
import Connection from '@/lib/connection';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { teamIds, matchName, matchDescription } = await request.json();
  const gameId = uuidv4();

  const connection = await Connection.getInstance().getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert into Games table
    await connection.query(
      'INSERT INTO Games (GAME_ID, NAME, COMMENT, TIME, TEAM_ID_1, TEAM_ID_2, TEAM_ID_3, TEAM_ID_4, IS_TEST) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 0)',
      [gameId, matchName, matchDescription, ...teamIds, ...Array(4 - teamIds.length).fill(null)]
    );

    // Insert initial hands for each team
    for (const teamId of teamIds) {
      await connection.query(
        'INSERT INTO Hands (GAME_ID, TEAM_ID, ROUND, HAND, IS_WINNER, WIND, HAND_SCORE) VALUES (?, ?, 1, 0, NULL, NULL, 0)',
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
