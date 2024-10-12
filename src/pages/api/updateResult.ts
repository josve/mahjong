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

    // Calculate and update the hand_score for each team
    await Promise.all(Object.entries(scores).map(async ([teamId, score]) => {
      const handScore = calculateHandScore(score, hands[0].EAST_TEAM, hands[0].WINNER, teamId);
      await connection.query(
        "UPDATE Hands SET HAND = ?, HAND_SCORE = ? WHERE MATCH_ID = ? AND ROUND = ? AND TEAM_ID = ?",
        [score, handScore, matchId, req.body.round, teamId]
      );
    }));

    function calculateHandScore(score: number, eastTeam: string, winner: string, teamId: string): number {
      // Implement the algorithm to calculate hand_score based on score, eastTeam, winner, and teamId
      // This is a placeholder implementation, replace it with the actual logic
      let handScore = score;
      if (teamId === eastTeam) {
        handScore += 10; // Example adjustment for east team
      }
      if (teamId === winner) {
        handScore += 20; // Example adjustment for winner
      }
      return handScore;
    }

    res.status(200).json({ message: 'Result updated successfully' });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
