import { NextApiRequest, NextApiResponse } from 'next';
import { Connection } from '@/lib/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { matchId, scores } = req.body;

  try {
    const connection = await Connection.getInstance().getConnection();

    // Fetch the east team and winner from the database
    const [hands] = await connection.query(
      "SELECT EAST_TEAM, WINNER FROM Hands WHERE MATCH_ID = ? AND ROUND = ?",
      [matchId, req.body.round]
    );

    // Update the scores for the round
    await Promise.all(Object.entries(scores).map(async ([teamId, score]) => {
      await connection.query(
        "UPDATE Hands SET HAND = ? WHERE MATCH_ID = ? AND ROUND = ? AND TEAM_ID = ?",
        [score, matchId, req.body.round, teamId]
      );
    }));

    res.status(200).json({ message: 'Result updated successfully' });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
