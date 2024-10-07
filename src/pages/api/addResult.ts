import { NextApiRequest, NextApiResponse } from 'next';
import Connection from '@/lib/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received request:', req.body);
    const { scores, eastTeam, winner, matchId } = req.body;

    const windOrder = ['E', 'N', 'W', 'S'];

    const connection = await Connection.getInstance().getConnection();
    try {
      const teamIds = Object.keys(scores);
      const eastIndex = teamIds.indexOf(eastTeam);

      for (let i = 0; i < teamIds.length; i++) {
        const teamId = teamIds[i];
        const score = scores[teamId];
        const wind = windOrder[(i - eastIndex + 4) % 4];

        console.log(`Inserting result for team ${teamId}: score=${score}, wind=${wind}, isWinner=${teamId === winner}`);

        await connection.query(
          'INSERT INTO Hands (GAME_ID, TEAM_ID, HAND_SCORE, IS_WINNER, WIND) VALUES (?, ?, ?, ?, ?)',
          [matchId, teamId, score, teamId === winner, wind]
        );
      }
      console.log('Results added successfully');
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
