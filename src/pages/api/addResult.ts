import { NextApiRequest, NextApiResponse } from 'next';
import Connection from '@/lib/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { scores, eastTeam, winner, matchId } = req.body;

    const connection = await Connection.getInstance().getConnection();
    try {
      // Insert each team's score into the Hands table
      for (const [teamId, score] of Object.entries(scores)) {
        await connection.query(
          'INSERT INTO Hands (GAME_ID, TEAM_ID, HAND_SCORE, IS_WINNER, WIND) VALUES (?, ?, ?, ?, ?)',
          [matchId, teamId, score, teamId === winner, eastTeam]
        );
      }
      res.status(200).json({ message: 'Results added successfully' });
    } catch (error) {
      console.error('Error adding results:', error);
      res.status(500).json({ error: 'Failed to add results' });
    } finally {
      connection.release();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
