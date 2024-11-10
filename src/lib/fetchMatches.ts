import Connection from "@/lib/connection";

export async function getAllMatches(): Promise<{
  GAME_ID: string;
  TIME: Date;
  NAME: string;
  COMMENT: string;
  TEAM_ID_1: string;
  TEAM_ID_2: string;
  TEAM_ID_3: string;
  TEAM_ID_4: string;
}[]> {
  const connection = await Connection.getInstance().getConnection(); // Get a connection
  try {
    const [matches]: any = await connection.query(
        "SELECT GAME_ID, TIME, NAME, COMMENT, TEAM_ID_1, TEAM_ID_2, TEAM_ID_3, TEAM_ID_4 FROM Games WHERE IS_TEST = 0 ORDER BY TIME DESC"
    );
    return matches;
  } finally {
    connection.release(); // Ensure the connection is released
  }
}

export default async function fetchMatches(): Promise<{
  GAME_ID: string;
  TIME: Date;
  NAME: string;
  COMMENT: string;
  TEAM_ID_1: string;
  TEAM_ID_2: string;
  TEAM_ID_3: string;
  TEAM_ID_4: string;
  IS_TEST: boolean;
  hands: {
    ROUND: number;
    GAME_ID: string;
    TIME: Date;
    HAND: number;
    IS_WINNER: boolean;
    WIND: string;
    TEAM_ID: string;
    HAND_SCORE: number;
    IS_TEST: boolean;
  }[];
}[]> {
  const connection = await Connection.getInstance().getConnection();
  try {
    let query = "SELECT * FROM Games WHERE IS_TEST = 0 ORDER BY TIME ASC";

    const [games]: any = await connection.query(query);

    // Fetch hands for each game
    for (const game of games) {
      const [hands] = await connection.query(
        "SELECT * FROM Hands WHERE GAME_ID = ? ORDER BY ROUND ASC",
        [game.GAME_ID]
      );
      game.hands = hands;
    }

    return games;
  } finally {
    connection.release();
  }
}
