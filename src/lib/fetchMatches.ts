import Connection from "@/lib/connection";
import {Game, GameWithHands} from "@/types/db";

export async function getAllMatches(): Promise<Game[]> {
  const connection = await Connection.getInstance().getConnection(); // Get a connection
  try {
    const [matches]: any = await connection.query(
        "SELECT * FROM Games WHERE IS_TEST = 0 ORDER BY TIME DESC"
    );
    return matches;
  } finally {
    connection.release(); // Ensure the connection is released
  }
}

export default async function fetchMatches(): Promise<GameWithHands[]> {
  const connection = await Connection.getInstance().getConnection();
  try {
    let query = "SELECT * FROM Games WHERE IS_TEST = 0 ORDER BY TIME";

    const [games]: any = await connection.query(query);

    // Fetch hands for each game
    for (const game of games) {
      const [hands] = await connection.query(
        "SELECT * FROM Hands WHERE GAME_ID = ? ORDER BY ROUND",
        [game.GAME_ID]
      );
      game.hands = hands;
    }

    return games;
  } finally {
    connection.release();
  }
}
